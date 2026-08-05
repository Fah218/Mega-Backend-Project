const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema= new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }

})


async function sendVerification(email,otp){
    try{
        const mailResponse = await mailSender(email, "email verifiaction for study notion ", otp);

        console.log("email sent successfully " , mailResponse);

    } catch(error){

    }
}

OTPSchema.pre("save", async function(next){
    await sendVerification(this.email,this.otp);
    next();
});

module.exports=mongoose.model("OTP",OTPSchema);