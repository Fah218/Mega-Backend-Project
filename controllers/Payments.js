const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/CourseEnrollmentEmail");

const mongoose = require("mongoose");
const crypto = require("crypto");



// capture the payment and initiate the Razorpay Order

exports.capturePayment= async (req,res)=>{

    // get course and user Id
    const {course_id} = req.body;
    const userId = req.user.id;
    // validate

   // valid course id
    if(!course_id){
        return res.json({
            status:false,
            message:"Please provide valid course id",
        })
    }
    
    // valid course details 
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"could not find the course",
            });
        }

     // user already pay for the course

     const uid= new mongoose.Types.ObjectId(userId);
     if(course.studentEnrolled.includes(uid)){
        return res.status(200).json({
            success:false,
            message:"Student is already enrolled",
        });
     }




    }
    catch(error){

        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

        
    }

   
    // order create 
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    }


    try{
        // initialize the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);


       // return response

       return res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount:paymentResponse.amount,

       })

    }
    catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"could not initiate the order",
        })

    }


};


// verify Signature of Razorpay and Server

exports.verifySignature = async (req,res)=>{
     const webhookSecret = "12345678";
     

     const signature = req.headers["x-razorpay-signature"];

     const shasum= crypto.createHmac("sha256",webhookSecret);
     shasum.update(JSON.stringify(req.body));
     const digest = shasum.digest("hex");


     if(signature === digest){
        console.log("payment is authorized");

        const {courseId , userId} = req.body.payload.payment.entity.notes;


        try{
            // fulfill the action

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentEnrolled:userId}},
                {new:true},
            )
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found",
                })
            }

            console.log(enrolledCourse);


            // find the student and add the course to their enrolled course

            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true},
            )

            console.log(enrolledStudent);



            // mailsend to purchase studnet 

            const emailResponse = await mailSender(
                           enrolledStudent.email,
                           "congratulations from codehelp",
                           "congratulation  u r onboard into new Codehelp coirse"
            );

            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"signature verified and the course added",
            })

        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })

        }

     }

     else{
        return res.status(400).json({
            success:false,
            message:"invalid response",
        })
     }


}
