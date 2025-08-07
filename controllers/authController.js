const User = require("../models/userModel");
const asyncWrapper = require("../errors/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");
const { signInToken } = require("../utils/authentication");

exports.register = asyncWrapper(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signInToken(newUser);

  res.status(StatusCodes.CREATED).json({
    status: "success",
    token,
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    return next(new BadRequestError("You have to enter email and password."));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new UnauthorizedError("Invalid Credential!"));
  }
  const candidPass = await user.confirmPassword(password);
  if (!candidPass) {
    return next(new UnauthorizedError("Invalid Credential!"));
  }
  token = signInToken(user);

  res.status(StatusCodes.OK).json({
    status: "success",
    mesage: "You logged in successfully",
    data: user,
    token,
  });
});
