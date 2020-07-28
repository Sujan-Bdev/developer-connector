const mongoose = require("mongoose");
const validator = require("validator");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photo: {
      type: String,
      default: "default.jpg"
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: [true, "Please provide your Status"],
    },
    skills: {
      type: [String],
      required: [true, "Please provide your skills"],
    },
    bio: {
      type: String,
    },
    githubUsername: {
      type: String,
    },
    education: [
      {
        school: {
          type: String,
        },
        degree: {
          type: String,
        },
        fieldOfStudy: {
          type: String,
        },
        from: {
          type: Date,
        },
        to: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    experience: [
      {
        title: {
          type: String,
        },
        company: {
          type: String,
        },
        location: {
          type: String,
        },
        from: Date,
        to: Date,
        current: {
          type: Boolean,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    date: {
      type: Date,
      default: Date.now
    }
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

profileSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });

  next();
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
