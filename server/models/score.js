const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      max: 3,
    },
    score: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Score", scoreSchema);
