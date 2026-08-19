const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async(req,res) => {
    // get email from the body
    try{
    const email = req.body.email;
    // check user for this email , email validation 
    const user = await User.findOne({email:email});
    if(!user){
        return res.json({success:false,
            message:"Your email is not registered with us"})
        
    }




    // generate token
    const token = crypto.randomUUID();


    // update the user by adding te token and expire time 
    const updatedDetails = await User.findOneAndUpdate({email:email}, {
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000,
    },{new:true}
)
    // cerate url 
    const url = `http://localhost:3000/update-password/${token}`;
    // send the mail containing te url
    await mailSender(email,"Password reset link", `password reset link: ${url}`);
    // return res

    return res.json({
        success:true,
        message:"email sent successfully , please check email and change password"
    })

    }
    catch (error) {
    console.log("RESET PASSWORD TOKEN ERROR:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
}



// resetPassword


exports.resetPassword= async (req,res)=>{
    try{

        // data fetch
        const {password,confirmPassword,token} = req.body;



        // validation

        if(password!=confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }
        // get user details form db using token
        const userDetails = await User.findOne({token:token});


        // if no entry - invalid token

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            })
        }

        // token time check

        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token is expired please regenerate your token",
            })
        }

        // hash Password

        const hashPassword = await bcrypt.hash(password,10);



        // password updated

        await User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
        );
        // return response

        return res.status(200).json({
            success:true,
            message:"password reset successfull",
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "Something went wrong"
        })
    }
}