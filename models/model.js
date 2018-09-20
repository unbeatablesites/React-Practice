
const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const News = new Schema({
  headline: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  summary: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  url: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  comments: {
    type: Array
  },
  saved: {
    type: Boolean,
    default: false
  }
});


const collection = "stories";
const Model = mongoose.model("Model", News, collection);


module.exports = Model;