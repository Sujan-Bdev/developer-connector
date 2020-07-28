const multer = require("multer");
const sharp = require("sharp");
const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req,file,cb) => {
//       // user-765ddf4548d8f-62644841111.jpeg
//       const ext = file.mimetype.split('/')[1];
//       cb(null,`user-${req.user.id}-${Date.now()}.${ext}` )
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an Image!Please Upload only images.`, 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next()
};

exports.getAllProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.find();
  if (!profile) {
    return next(new AppError(`There are no any profile in the system`, 404));
  }
  res.status(200).json({
    status: "success",
    length: profile.length,
    data: {
      profile,
    },
  });
});

exports.createProfile = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  console.log(req.file);
  console.log(req.body);

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (status) profileFields.status = status;
  if (bio) profileFields.bio = bio;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }

  // build social object

  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  // user photo
  if (req.file) profileFields.photo = req.file.filename;

  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: profileFields,
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      status: "success",
      data: {
        profile,
      },
    });
  }

  profile = await Profile.create(profileFields);

  res.status(201).json({
    status: "success",
    data: {
      profile,
    },
  });
});

exports.getAllProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.find();
  if (!profile) {
    return next(new AppError(`There are no any profile in the system`, 404));
  }
  res.status(200).json({
    status: "success",
    length: profile.length,
    data: {
      profile,
    },
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId });
  if (!profile) {
    return next(new AppError(`No User found with that ID`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  const post = await Post.deleteMany({ user: req.user.id });

  const profile = await Profile.findOneAndRemove({
    user: req.user.id.toString(),
  });
  const user = await User.findOneAndRemove({ _id: req.user.id });

  if (!profile && !user) {
    return next(new AppError(`No User found with that ID`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "User Deleted",
  });
});

exports.createExperience = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { title, company, location, from, to, current, description } = req.body;
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new AppError(`No user found`, 404));
  }
  profile.experience.unshift(newExp);
  await profile.save();
  res.status(201).json({
    status: "success",
    data: {
      profile,
    },
  });
});

exports.deleteExperience = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new AppError(`Cannot find profile with that ID`, 404));
  }
  const removeIndex = profile.experience
    .map((item) => item.id)
    .indexOf(req.params.expId);
  profile.experience.splice(removeIndex, 1);
  await profile.save();
  res.status(200).json({
    status: "success",
    length: profile.experience.length,
    data: {
      profile,
    },
  });
});

exports.createEducation = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { school, degree, filedOfStudy, from, to, description } = req.body;
  const newEducation = {
    school,
    degree,
    filedOfStudy,
    from,
    to,
    description,
  };
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new AppError(`No user found`, 404));
  }
  profile.education.unshift(newEducation);
  await profile.save();
  res.status(201).json({
    status: "success",
    data: {
      profile,
    },
  });
});

exports.deleteEducation = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return next(new AppError(`Cannot find profile with that ID`, 404));
  }
  const removeIndex = profile.education
    .map((item) => item.id)
    .indexOf(req.params.eduId);
  profile.education.splice(removeIndex, 1);
  await profile.save();
  res.status(200).json({
    status: "success",
    length: profile.education.length,
    data: {
      profile,
    },
  });
});

exports.checkMe = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new AppError(`Cannot find user profile!!`));
  }
  res.status(200).json({
    status: "Success",
    profile,
  });
});
