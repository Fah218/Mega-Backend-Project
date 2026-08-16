const mongoose=require("mongoose");
const { resetPassword } = require("../controllers/ResetPassword");

const userSchema = new mongoose.Schema({
    fisrtName:{
        type:String,
        require:true,
        trim:true,
    },
    lastName:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        require:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profiles",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image:{
        type:String,
        required:true,

    },
    token:{
        type:String,
        required:true,
    },
    resetPasswordExpires:{
        type:Date,
    },




    courseProgress:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"CourseProgress",
    }
]

})


// Prevent model overwrite
module.exports = mongoose.models.User || mongoose.model("User", userSchema);