const Section = require("../models/Section");
const Course = require("../models/Course");

exports.CreateSection= async(req,res)=>{
    try{
    // data fetch krna
    const {sectionName, courseId} = req.body;


    // data validation

    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Missing Properties",
        })
    }
    // create section 

    const newSection = await Section.create({sectionName});
    // update course with section ObjectId
    const updateCourseDetails = await Course.findByIdAndUpdate(
                         courseId,
                         {
                            $push:{
                                courseContent:newSection._id,
                            }
                         },
                         {new:true},
    )

    // use populate to replace the sections/subsections both in the updatedCourseDetails
    // return response 

    return res.status(200).json({
        success:true,
        message:"Section created Successfully",
        updatedCourseDetails,
    })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to create the section please try again",
            error:error.message
        })

    }
}


exports.updateSection=async(req,res)=>{
    try{
    //data fetch

    const {SectionId, sectionName} = req.body;


    //    data Validite


    if( !SectionId || !sectionName){
        return res.status(400).json({
            success:false,
            message:"Missing Properties",
        })
    }
    //    section update 
    const section = await Section.findByIdAndUpdate(
                         SectionId,
                         {
                           sectionName: sectionName
                         },
                         {new:true}
    )
    //    return response 

     return res.status(200).json({
        success:true,
        message:"Section updated Successfully",
        section,
    })




    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the section please try again",
            error:error.message
        })

    }
}

exports.deleteSection = async (req, res) => {
    try {
        // data fetch
        const {SectionId} = req.params;

        // section update 
        await Section.findByIdAndDelete(SectionId);
        
        // TODO[TESTING]// do we need to delete the schema for the course schema 
        await Course.updateMany(
            { courseContent: SectionId },
            { $pull: { courseContent: SectionId } }
        );
        // return response 
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete the section please try again",
            error: error.message
        });
    }
};