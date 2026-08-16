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
        const courseDetails = await course.findOne({
                          _id: courseId,
                          studentEnrolled: {$elemMatch: {$eq: userid}}
        });
        if(!courseDetails){
            return res.status(404).json({
               success:false,
               message:"student is not enrolled int the course",
            })
        }
        // chekc user already Rate

        const alreadyReviewed = await RatingAndReviews.findOne({
            user:userid,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by the user"
            })
        }


        // create rating and review

        const ratingReview = await RatingAndReviews.create({
            rating,review,
            course:courseId,
            user:userid
        })

        
        // update course with this rating 

        const updatedCourseDetails = await course.findByIdAndUpdate(courseId, {
            $push:{
                ratingandReviews:ratingReview._id
            }
        }, {new:true});
        console.log(updatedCourseDetails);
        // return response

        return res.status(200).json({
            success:true,
            message:"Rating and reviewed update successfully",
            ratingReview
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

    const result = await RatingAndReviews.aggregate([
        {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
            }
        },
        {
            $group:{
                _id:null,
                averageRating:{
                    $avg:"$rating"
                }
            }
        }
    ])
    //   return rating 

    if(result.length >0){
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





}







// getAllrating


exports.getAllRating = async(req,res)=>{
  



       try{

        const allReview = await RatingAndReviews.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image"
        })
        .populate({
            path:"course",
            select:"courseName",
        })
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
            message:error.message


        })

       }

}