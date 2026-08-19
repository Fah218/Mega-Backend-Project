const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// sendOTP
exports.sendOTP = async (req, res) => {
    try {
        // fetch email fprm req ki body
        const { email } = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({ email });

        // if user already exist then return the res
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exist",
            });
        }

        // genertae otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated", otp);

        // check unique otp or not 
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //   create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return res successfully
        return res.status(200).json({
            success: true,
            message: "OTP send Successfully",
            otp,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// sign up
exports.signup = async (req, res) => {
    try {
        //    data fetch krop req ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //    validation krlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        //    password match krenge 
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and confirm password do not match, please try again"
            });
        }

        //    check user already exist or not 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already register",
            });
        }

        //    find most receent OTP for the user 
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOTP);

        //    validate the otp 
        if (recentOTP.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        //    hash the pass 
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //    entry create 
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`
        });

        //    return res 
        return res.status(200).json({
            success: true,
            message: "user is registered",
            user,
        });

    } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
};

// login
exports.login = async (req, res) => {
    try {

    // get the data form body 


    const {email,password}= req.body;
      // valiadte data 
    if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"all fields are require please try again"
        })
    }

  
    // user check exist or not 
    const user = await User.findOne({email}).populate("additionalDetails");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not registered. Please sign up.",
        })
    }
    // generate Token

    if(await bcrypt.compare(password, user.password)){
       const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType
       }

       const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
       });
       user.token = token;
       user.password = undefined;

       // create cookie and send res
       const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
       };
       return res.cookie("token", token, options).status(200).json({
           success: true,
           token,
           user,
           message: "login successfully "
       });
    } else {
        return res.status(401).json({
            success: false,
            message: "Password incorrect"
        });
    }

        
    } catch(error) {
        console.log("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed, please try again",
        });
    }
};


// changePassword
