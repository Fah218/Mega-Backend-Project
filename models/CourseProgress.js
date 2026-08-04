const mongoose=require("mongoose");

const courseProgressSchema= new mongoose.Schema({
   courseID:{
    type:mongoose.Schema.Types.ObjectId,
    res:"Course",
   },

   completedVideos:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }
   ]
});

module.exports=mongoose.model("courseProgress",courseProgress);