const Section = require("../models/Section");
const Course = require("../models/Course");

exports.CreateSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        const newSection = await Section.create({
            sectionName,
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { returnDocument: "after" }
        );

        if (!updatedCourseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section created Successfully",
            updatedCourseDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create the section please try again",
            error: error.message,
        });
    }
};
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
                        { new: true }
    )

    if (!section) {
        return res.status(404).json({
            success: false,
            message: "Section not found",
        });
    }

    // return response 
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
        const {SectionId} = req.body;

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