const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler function

exports.createCourse = async (req,res)=>{
    try{
    //    fetch the data

    const {courseName , courseDescription , whatYouWillLearn , price , tag}= req.body;

    // get thumbnail


    const thumbnail = req.files.thumbnailImage;


    // valiadtion 

    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }

    // check for the instructor

    const userID = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor details",instructorDetails);



    if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message: "Instructor details not found",
        });
    }

    // check if tag is valid or not

    const categoryDetails = await Category.findById(tag);
    if(!categoryDetails){
        return res.status(404).json({
            success:false,
            message: "tag details not found",
        });
    }

    // upload img to uploadImageToCloudinary

const thumbnails = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

// create an entry for the new course 

const newCourse = await Course.create({
    courseName: courseName,
    courseDescription: courseDescription,
    instructor: instructorDetails._id,
    whatYouWillLearn: whatYouWillLearn,
    price: price,
    category: categoryDetails._id,
    thumbnail: thumbnails.secure_url,
});
    

// add new course to the schema of instructor

await User.findByIdAndUpdate(
    { _id: instructorDetails._id },
    {
        $push: {
            courses: newCourse._id
        }
    },
    { new: true }
);



// update the tag ka schema
await Category.findByIdAndUpdate(
    { _id: categoryDetails._id },
    {
        $push: {
            course: newCourse._id
        }
    },
    { new: true }
);
        
// return response

return res.status(200).json({
    success: true,
    message: "Course created successfully",
    data: newCourse
});




  
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
         success: false,
         message: "failed to create the course",
         error: error.message
        });

    }
}




// get all course handler functions

exports.showAllCourses = async(req,res)=>{

    try{
        const allCourses = await Course.find({});

        return res.status(200).json({
            success: true,
            message: "data for all the Courses fetch successfully",
            data: allCourses,
        });


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


// getCourseDetails

exports.getCourseDetails = async(req,res)=>{
    try{
    //    get id
    const {courseId} = req.body;

    // find course details
    const courseDetails = await Course.find(
        {_id:courseId}
    ).populate(
        {
            path:"instructor",
            populate:{
                path:"additionalDetails",
            }
        }
    )
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
        path:"courseContent",
        populate:{
            path:"subSection",
        },
    })
    .exec();



    // validation
    if(!courseDetails){
        return res.status(400).json({
            success:false,
            message:"Could not find the course with $(coirseId)",

        })
    }

    // return response

    return res.status(200).json({
        success:true,
        message:"course details fetched successfully",
    })



    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

