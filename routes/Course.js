const express = require("express");
const router = express.Router();

// Course Controllers Import
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

// Category Controllers Import
const {
  createCategory,
  showAllcategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  CreateSection,
  updateSection,
  deleteSection,
} = require("../controllers/Sections");

// Subsections Controllers Import
const {
  subSection,
  updateSubsection,
  deleteSubsection,
} = require("../controllers/Subsection");

// Rating and Review Controllers Import
const {
  createrating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

// Middlewares Import
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);


// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllcategory);
router.get("/getCategoryPageDetails", categoryPageDetails);


// ********************************************************************************************************
//                                      Section routes
// ********************************************************************************************************

router.post("/addSection", auth, isInstructor, CreateSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);


// ********************************************************************************************************
//                                      Subsection routes
// ********************************************************************************************************

router.post("/addSubSection", auth, isInstructor, subSection);
router.put("/updateSubSection", auth, isInstructor, updateSubsection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubsection);


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createrating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);








module.exports = router;
