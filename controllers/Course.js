const Course = require("../models/Course");
const Tag = require(""../models/Tags");
const User = require("../models/Users");
const uploadImageToCloudinary = require("../utils/imageUplaoder");

// create course handler function

exports.createCourse = async (req,res)=>{
    try{
    //    fetch the data

    const {courseName , courseDescription , whatYouWillLearn , price , tag}= req.body;

    // get thumbnail


    const thumbnail = req.files.thumbnailImage;


    // valiadtion 

    if(!courseName || !CourseDescription || !what u wiol learn || !price || !tag || !thumbnail){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }

    // check for the instructor

    const userID = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor details",instructorDetails);



    if(!InstructorDetails){
        return res.status(404).json({
            success:false,
            message;"Instructor details not found",

        })
    }

    // check if tag is valid or not

    const categorydetails = await Category.findById(tag);
    if(!categoryDetails){
        return res.status(404).json({
            success:false,
            message;"tag details not found",

    }

    // upload img to uploadImageToCloudinary

const thumbnails = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

// create an entry for the new course 

const newCourse = awiat Course.create({
    courseName:
    courseDescription,
    instructor:instructorDetails._id
    whatyouwill learn :whjat u will learn ,
    price ,
    tag:tagdetails._id,
    thumbnail:thumbnail._secure_url,




})
    

// add new course to the schema of instructor

await User .findByIdand Update{
    id:instructorDetail_id
{
    $push:{
        course:newCourse._id
    }

},
{new:true}
}



// updarte the tag ka schema
        
// return response

return res.status(200).json({
    success:true,
    message:cpurse created
    date:newCourse
})




  
    }
    catch(error){
        console.log(error);
        return res.status(500(json{
         success:false,
         message:"failed to creta ethe course,
         error:error.message"
        })

    }
}




// get all handler functions

exports.showAllCourses = async(req,res)=>{

    try{
        const allCourses = await Course.find({},{

            return res.status(200).json({
                success:true;
                message:"data for all the Courses fetch successfully",
            })
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
            error:error.message,
        })

    }

}