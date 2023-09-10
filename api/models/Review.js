const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
  user: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'User'}, 
  datePost: {type:Date, required:true},
  title: {type:String, required:true},
  content: {type:String, required:true},
  score: Number,
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;