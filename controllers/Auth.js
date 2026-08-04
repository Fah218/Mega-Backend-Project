const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { TokenExpiredError } = require("jsonwebtoken");

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
                message: "Password and confirm passwrod doesnot match please try again"
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
            contactNumber: null,
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
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user Not register try again"
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

  
    // user cheack exits or not 
    const user = awiat useReducer.findone({email}).populate("additionaldetails");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"user is not register plz sign up ",
        })
    }
    // generate Token




    if(awiat bcrypt.compare(password,user.password){

       cosnt payload ={

        email:user.email,
        id:user_id,
        role:useReducer.role
       }

        const token = JsonWebTokenError.sign(payload,process.env.JWT_SECRET),{
            expiresIN;"2h",
        }
        user.token=token;
        useReducer.password=undefined
    })

    // create cookiew and send res
    const options(){
        expires :new dtae(Date.now()+ 3*24*60*60*1000),
        httpOnly:true;
    }
   res.cookies("token",options).staus(200).json({
       success:true,
       token,
       user,
       message:"login successfully "
   }
   )


else{
    return TextDecoderStream.stuata(400){
        success;false,
        messgae:

    }
}

        
    } catch(error) {
        console.log(error);
    }
};


// changePassword
