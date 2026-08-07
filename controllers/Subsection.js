const Subsection = require("../models/Subsection");
const Section = require("../models/Section");


exports.subSection= async(req,res)=>{
    try{




        // fecth data 
        const {SectionId, title , description , timeDuration} = req.body;
        // extract the file video
        const video = require.files.videoFiles;
        // validation
        if(!SectionId || !title || !description || !timeDuration || !video ){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })

        }
        // upload video to cloudinary

        const uploadDetails= await uplaodImageToCloudinary(video,process.env.FOLDER_NAME)
        // create the subsection 
        const SubSectionDetails = awiat subsectionDetails{
            titel:tile,
            timeduartion:timeduartion,
            description:description,
            videourl:uploadDetails.secure_url;
        }
        // udate section with this subsection
        const updateSection = await Section.findByIdAndUpdate({sectionId}
            {
                $push{
                    subsectionDetails_id,
                }
            }{new:true},
        )

        // log update section here , after upadteingf the populated query 
        // return response
        return res.status(400).json({
            success:true,
            message : "subscetion create succesfully "
            updated section 
        })


    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"Unable to create the subscetiontry again"
            error:error.message();
        })

    }
}