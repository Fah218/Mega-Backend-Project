const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// updateProfile
exports.updateProfile = async (req, res) => {
    try {
        // get Data
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // get user id
        const id = req.user.id;

        // validation
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // find profile 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};






// deleteProfile
exports.deleteProfile = async (req, res) => {
    try {
        // get id 
        const id = req.user.id;

        // validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // HW: unenroll user from all enrolled Courses
        await Course.updateMany({studentEnrolled: id}, {$pull: {studentEnrolled: id}});

        // delete user 
        await User.findByIdAndDelete(id);

        // return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user cannot be deleted successfully",
            error: error.message,
        });
    }
};




// Get all user Details
exports.getAllUserDetails = async (req, res) => {
    try {
        // get id 
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
           success: true,
           message: "user data fetch successfully",
           data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};