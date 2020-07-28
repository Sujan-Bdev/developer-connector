const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });

  if (!posts) {
    return next(new AppError(`No any post found`, 404));
  }
  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
  if (!post) {
    return next(new AppError(`No post found with that post Id`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const profile = await Profile.findOne({user: req.user.id})
  if (!user) {
    return next(
      new AppError(`User cannot be found! Please log in Again!!`, 404)
    );
  }
  // console.log(user.name);
  const newPost = await Post.create({
    text: req.body.text,
    name: user.name,
    user: req.user.id,
    photo: profile.photo
  });

  res.status(201).json({
    status: "success",
    data: {
      post: newPost,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new AppError(`No post found with that Id`, 404));
  }

  if (post.user.toString() !== req.user.id) {
    return next(
      new AppError(`User is not authorized to delete this post`, 401)
    );
  }

  await post.remove();

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        msg: "Post already liked",
      });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json({
      status: "success",
      message: "You liked the post",
      noOfLikes: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

exports.unLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        msg: "Post has not yet been liked",
      });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.status(200).json({
      status: "success",
      message: "You un liked the post",
      noOfLikes: post.likes.length,
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addComment = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const user = await User.findById(req.user.id);
  const profile = await Profile.findOne({user: req.user.id})
  const newComment = {
    comment: req.body.comment,
    commenter: req.user.id,
    name: user.name,
    photo: profile.photo
  };
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comments: { $each: [newComment], $sort: { createdAt: -1 } } },
    },
    { new: true }
  )
    .populate("user", "name _id")
    .populate("comments", "name _id")
    .populate("profile", "photo");

  if (!post) {
    return next(new AppError(`No post found with that Id`, 404));
  }

  res.status(201).json({
    status: "success",
    post,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const comment = post.comments.find(
    (comment) => comment.id == req.params.commentId
  );
  if (!comment) {
    return next(new AppError(`No comments found with that Id`, 404));
  }

  //   check user

  if (comment.commenter.toString() !== req.user.id) {
    return next(new AppError(`User not authorized`, 401));
  }

  const removeIndex = post.comments
    .map((comment) => comment.commenter.toString())
    .indexOf(req.user.id);

  post.comments.splice(removeIndex, 1);

  await post.save();

  res.status(201).json({
    status: "success",
    noOfComments: post.comments.length,
    comments: post.comments,
    post,
  });
});
