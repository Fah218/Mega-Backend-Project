const Section = require("../models/Section");
const Course = require("../models/Course");

exports.CreateSection= async(req,res)=>{
    try{
    // data fetch krna
    const {SectionName,CourseId} = req.body;


    // data validation

    if(!sectionName || !CourseId){
        return res.status(400).json({
            success:true,
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
            message:"Unable to create the section please try again"
            error:error.message();
        })

    }
}


exports.updateSection=async(req,res)=>{
    try{
    //data fetch

    const {SectionId} = req.body;


    //    data Validite


    if( !SectionId){
        return res.status(400).json({
            success:true,
            message:"Missing Properties",
        })
    }
    //    section update 
    const section = await Section.findByIdAndDelete(
                         SectionId,
                         {
                           sectionName:
                         },
                         {new:true},
    )
    //    return response 

     return res.status(200).json({
        success:true,
        message:"Section updated Successfully",
        updatedCourseDetails,
    })




    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the section please try again"
            error:error.message();
        })

    }
}

exports.deleteSection({
    try{
    //    data fetch

    const {SectionId} = req.params;


   
    }
    //    section update 
    const section = await Section.findByIdAndUpdate(
                         (SectionId)
                         
    )
    // TODO[TESTING]// do we need to delete the schema for the course schema 
    //    return response 

     return res.status(200).json({
        success:true,
        message:"Section deleted Successfully",
        updatedCourseDetails,
    })




    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update the section please try again"
            error:error.message();
        })
})