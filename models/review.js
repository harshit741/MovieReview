const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    default: ""
  },
  movieName: {
    type: String,
    required: true,
  },
  // movieName: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Movies'               
  // },
});
const Reviews = mongoose.model("Review", reviewSchema);
module.exports = Reviews;
