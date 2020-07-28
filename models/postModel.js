const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: [true, "Post must be made by the logged in User"],
    },
    text: {
      type: String,
      required: [true, `Please provide a text to post`],
    },
    name: {
      type: String,
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [
      {
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          //   required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        name: {
          type: String,
        },
        photo: {
          type: String,
          default: 'default.jpg'
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "profile",
    select: "photo",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
