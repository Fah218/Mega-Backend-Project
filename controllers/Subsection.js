const Subsection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");



exports.subSection = async (req, res) => {
    try {


        // fecth data 
        const { SectionId, title, description, timeDuration } = req.body;
        // extract the file video
        const video = req.files ? req.files.videoFile : null;


        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        // validation
        if (!SectionId || !title || !description || !timeDuration || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create the subsection 
        const subSectionDetails = await Subsection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        });

        // update section with this subsection
        const updateSection = await Section.findByIdAndUpdate(
            SectionId,
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true }
        ).populate("subSection");

        // return response
        return res.status(200).json({
            success: true,
            message: "subsection created successfully",
            data: updateSection
        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create the subsection, try again",
            error: error.message
        });
    }
}


// update subsection
exports.updateSubsection = async (req, res) => {
    try {
        // fetch data
        const { subSectionId, title, description, timeDuration } = req.body;

        // validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection ID is required",
            });
        }

        // fetch subsection
        const subSection = await Subsection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        // extract the file video if updated
        if (req.files && req.files.videoFile) {
            const video = req.files.videoFile;
            // upload video to cloudinary
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
        }

        // update other fields if provided
        if (title) subSection.title = title;
        if (description) subSection.description = description;
        if (timeDuration) subSection.timeDuration = timeDuration;

        // save the updated subsection
        await subSection.save();

        // return response
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data: subSection
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update the subsection, please try again",
            error: error.message
        });
    }
}

// delete subsection
exports.deleteSubsection = async (req, res) => {
    try {
        // fetch data
        const { subSectionId, sectionId } = req.body;

        // validation
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Subsection ID and Section ID are required",
            });
        }

        // update section schema to pull/remove the subsection ID
        await Section.findByIdAndUpdate(
            sectionId,
            {
                $pull: {
                    subSection: subSectionId,
                }
            }
        );

        // delete subsection from db
        const deletedSubSection = await Subsection.findByIdAndDelete(subSectionId);

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        // return response
        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete the subsection, please try again",
            error: error.message
        });
    }
}
