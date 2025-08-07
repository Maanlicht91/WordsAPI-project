const express = require("express");
const {
  getAllWords,
  addNewWord,
  updateWord,
  deleteWord,
} = require("../controllers/wordsController");
const { protectRoute, restrictTo } = require("../utils/authentication");

const router = express.Router();

router
  .route("/:id")
  .patch(updateWord)
  .delete(protectRoute, restrictTo("admin"), deleteWord);
router.route("/").get(protectRoute, getAllWords).post(addNewWord);

module.exports = router;
