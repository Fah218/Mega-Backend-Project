const RatingAndReviews = require("../models/RatingAndReview");
const user = require("../models/user");
const course = require("../models/course");


// createRating 
exports.createrating = async(req,res)=>{
    try{
        // get user Id
        const userid = req.user.id
        // fetch data from req ki body 
        const {rating, review , courseId} = req.body;
        // check if user is enrolled
        const courseDetails = await Course.findOne(
                          {_id:courseid},
                          studentEnrolled:{elementMtach:{$eq:userid}}
        );
        if(!courseDetails){
            return res.status(404).json({
               success:false,
               message:"student is not enrolled int the course",
            })
        }
        // chekc user already Rate

        const alreadyReviewed = await RayingAndreviewed.findOne({
            user:userId,
            cousre:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by the user"
            })
        }


        // create rating and review

        const ratingAndReviews = await ratingAndReviews.create({
            rating,review,
            course:courseId,
            
        })

        
        // update course with this rating 

        consty updatedCourse details = await course.findByIdAndUpdate(_id:courseId){
            $push:{
                tratingAndReviewed:ratingReview._id
            },
            {new:true};
        }
        console.log(updatedCourseDetails);
        // return response

        return res.status(200).json({
            success:true,
            message:"Rating and reviewed update successfully",
            rating review
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Rating review not done"
        })

    }
}


// getAveragerating 


exports.getAverageRating = async(req,res)=>{
    //   get course id
    
    const courseId = req.body.courseId;

    //   calculate avg rating 

    const result = aeiat RatingAndReview.aggregate({
        $match:{
            course:new monggose.Types.ObjectId(courseId),
        },

        {
            $group:{
                _id:null,
                averageRating:{
                    {$avg:$rating},
                }
            }
        }
    })
    //   return rating 

    if(result.length()
    >0){
return res.status(200).json({
    success:true,
    averagerating:result[0].averageRating,
})

}



// if no rating review exists

return res.status(200).json({
    success:true,
    message:"average rating is 0 , no rating given till now",
})





})







// getAllrating


exports.getAllRating = async(req,res)=>{
  



       try{

        const allReview = await RatingAndReview.find({})
        .sort({rating:"desc"});
        .populate({
            path:"user",
            select:"firstName lastName email image"
        });
        .populate{
            path:"course",
            select:"courseName",
        }
        .exec();

        return res.status(200).json({
            success:true,
            message:"All review fetch successfully",
            data:allReview,

        })
          

       }
       catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message;


        })

       }

}