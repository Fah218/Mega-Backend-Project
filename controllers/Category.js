const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const category = require("../models/category");
const Tag = require("../models/category");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
    try {
        // fetch data
        const { name, description } = req.body;
        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // create entry in db
        const categoryDetails = await Tag.create({
            name: name,
            description: description,
        });

        console.log(categoryDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// get all catefory 

exports.showAllcategory = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true });
        res.status(200).json({
            success: true,
            message: "All category returned successfully",
            data: allTags,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//category pageDetails


exports.categoryPageDetails = async (req, res) => {
    try {
        // get categorId
        const { categoryId } = req.body;
        // get Courses for specied category
        const selectedCategory = await category.findById(categoryId)
            .populate("course")
            .exec();
        // validate

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "data not found",
            });
        }
        // get courses for differnet cousre 

        const differentCategories = await category.find({
            _id: { $ne: categoryId },
        })
            .populate("course")
            .exec();

        // get top selling courses
        const allCategories = await category.find()
            .populate({
                path: "course"
            })
            .exec();

        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses
            .sort((a, b) => (b.studentEnrolled?.length || 0) - (a.studentEnrolled?.length || 0))
            .slice(0, 10);

        // return response

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                mostSellingCourses
            }
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};