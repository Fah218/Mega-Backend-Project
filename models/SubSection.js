const mongoose=require("mongoose");

const SubSectionSchema= new mongoose.Schema({
      title:{
        type:String,
      },
      timeDuration:
      {
        type:String,
      },
      description:{
        type:String,
      },
      videoUrl:{
        type:String,
      },




});

// SubSection
module.exports =
    mongoose.models.subsection || mongoose.model("subsection", SubSectionSchema);