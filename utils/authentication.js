const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const User = require("../models/userModel");

const signInToken = (user) => {
  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          "You do not have permission to perform this action"
        )
      );
    }
    next();
  };
};

const protectRoute = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(
      new UnauthorizedError(
        "You are not logged in! Please log in to get access."
      )
    );
  }
  const token = req.headers.authorization.split(" ")[1];

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    return next(
      new UnauthorizedError(
        "The user belonging to this token does no longer exist."
      )
    );
  }

  req.user = currentUser;
  next();
};

module.exports = { signInToken, protectRoute, restrictTo };
