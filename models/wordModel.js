const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, "You have to enter a word!"],
      unique: true,
    },
    definition: {
      type: String,
      required: [true, "You have to give a definition"],
    },
    synonym: {
      type: [String],
      required: [true, "You have to write at least one synonym."],
    },
    antonym: {
      type: [String],
      required: [true, "You have to write at least one antonmy."],
    },
    sentence: {
      type: [String],
      default: "No example written.",
    },
    partOfSpeech: {
      type: String,
      enum: [
        "verb",
        "noun",
        "adjective",
        "adverb",
        "pronoun",
        "phrasal verb",
        "determiner",
        "preposition",
        "interjection",
        "conjuction",
      ],
      default: "noun",
    },
  },
  { timestamps: true }
);

const Word = mongoose.model("words", wordSchema);

module.exports = Word;
