const CustomAPIError = require("./customApi");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
