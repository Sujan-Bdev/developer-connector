const express = require("express");
const { check } = require("express-validator");

exports.createUser = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password of min length 8 is required").isLength({
    min: 8,
  }),
  check(
    "passwordConfirm",
    "Password Confirm of min length 8 is required"
  ).isLength({
    min: 8,
  }),
];

exports.loginUser = [
  check("email", "Email is required").isEmail(),
  check("password", "Password of min length 8 is required").isLength({
    min: 8,
  }),
 
];

exports.createExperience = [
  check("title", "Title is required").not().isEmpty(),
  check("company", "Company is required").not().isEmpty(),
  check("from", "From is required").not().isEmpty(),
];

exports.createEducation = [
  check("school", "School is required").not().isEmpty(),
  check("degree", "Degree is required").not().isEmpty(),
  check("fieldOfStudy", "Field Of Study is required").not().isEmpty(),
  check("from", "From is required").not().isEmpty(),
];

exports.addComment = [check("comment", "Comment is required").not().isEmpty()];

exports.addProfile = [
  check("skills", "Skills is required").not().isEmpty(),
  check("status", "Status is required").not().isEmpty(),


]
