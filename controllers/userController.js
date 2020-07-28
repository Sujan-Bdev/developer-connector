const factory = require("./handleFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getAll = (req, res, next) => {
  res.status(200).json({
    message: "Hello Testing",
  });
};

exports.getLoggedInUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError(`Cannot find user with that id`, 404));
  }
  res.status(200).json({
    user,
  });
});
