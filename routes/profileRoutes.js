const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const validate = require("../utils/validate");



const router = express.Router();

router
  .route("/me")
  .get(authController.protect, profileController.checkMe)
  .post(
    authController.protect,
    profileController.uploadUserPhoto,
    profileController.resizeUserPhoto,
    validate.addProfile,
    profileController.createProfile
  )
  .delete(authController.protect, profileController.deleteProfile);

router.route("/").get(profileController.getAllProfile);
router.route("/:userId").get(profileController.getProfile);

router
  .route("/experience")
  .patch(
    authController.protect,
    validate.createExperience,
    profileController.createExperience
  );

router
  .route("/experience/:expId")
  .delete(authController.protect, profileController.deleteExperience);

router
  .route("/education")
  .patch(
    authController.protect,
    validate.createEducation,
    profileController.createEducation
  );

router
  .route("/education/:eduId")
  .delete(authController.protect, profileController.deleteEducation);

module.exports = router;
