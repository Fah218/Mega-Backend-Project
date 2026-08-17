const express = require("express");
const router = express.Router();

const {
  updateProfile,
  deleteProfile,
  getAllUserDetails,
  updateDisplayPicture,
} = require("../controllers/Profile");

const { auth } = require("../middlewares/auth");

// Delete User Account
router.delete("/deleteProfile", auth, deleteProfile);
// Update User Profile
router.put("/updateProfile", auth, updateProfile);
// Update Profile Picture
router.put("/updateProfilePicture", auth, updateDisplayPicture);
// Get All User Details
router.get("/getUserDetails", auth, getAllUserDetails);

module.exports = router;
