const { StatusCodes } = require("http-status-codes");
const Word = require("../models/wordModel");
const asyncWrapper = require("../errors/asyncWrapper");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllWords = asyncWrapper(async (req, res, next) => {
  const features = new APIFeatures(Word.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Get total count for pagination
  const totalDocs = await Word.countDocuments(features.query._conditions); //gives you the filter object for your query.You use it to count all matching documents for pagination, not just the current page.
  const totalPages = Math.ceil(totalDocs / features.limit);
  const currentPage = features.page;

  if (currentPage > totalPages && totalPages !== 0) {
    return next(new BadRequestError("Too high pages that's why no results!"));
  }

  const words = await features.query;

  res.status(StatusCodes.OK).json({
    status: "success",
    results: words.length,
    currentPage,
    totalPages,
    data: words,
  });
});

exports.addNewWord = asyncWrapper(async (req, res, next) => {
  const newWord = await Word.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: newWord,
  });
});

exports.updateWord = asyncWrapper(async (req, res, next) => {
  const updatedWord = await Word.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedWord) {
    return next(new NotFoundError("There is no matching word with this id"));
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    data: updatedWord,
  });
});

exports.deleteWord = asyncWrapper(async (req, res, next) => {
  const deletedWord = await Word.findByIdAndDelete(req.params.id);

  if (!deletedWord) {
    return next(new NotFoundError("There is no matching word with this id"));
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "The word has been deleted successfully",
  });
});
