const { StatusCodes } = require("http-status-codes");
const { CustomAPIError, BadRequestError } = require("../errors");

const handleValidationDBError = (error) => {
  const value = Object.values(error.errors).map((el) => el.message);
  return new BadRequestError(`Invalid input data: ${value.join(". ")}`);
};

const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new BadRequestError(message);
};

const sendErrorReponse = (err, res, isDev) => {
  const response = {
    status: err.status,
    message: err.message,
  };

  if (isDev) {
    response.error = err;
    response.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

module.exports = (err, req, res, next) => {
  //let error = Object.create(Object.getPrototypeOf(err));
  //Object.assign(error, err, { message: err.message });

  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  if (err.name === "ValidationError") err = handleValidationDBError(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  sendErrorReponse(err, res, process.env.NODE_ENV === "development");
};
