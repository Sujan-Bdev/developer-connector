const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const validate = require("../utils/validate");


router
  .route("/")
  .get(authController.protect, postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router
  .route("/:postId")
  .get(authController.protect, postController.getPost)
  .delete(authController.protect, postController.deletePost);

router
  .route("/like/:id")
  .patch(authController.protect, postController.likePost);

router.route("/unlike/:id").patch(authController.protect, postController.unLikePost)
router.route("/comments/:id").post(authController.protect,validate.addComment,postController.addComment)
router.route("/uncomment/:id/:commentId").delete(authController.protect, postController.deleteComment)


module.exports = router;
