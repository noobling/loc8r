var mongoose = require('mongoose');

var openingTimeSchema = new mongoose.Schema({
  days: String,
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
  authorName: {type: String},
  rating: {type: Number, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, 'default': Date.now}
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, 'default': 0, min: 0, max: 5},
  facilities: [String],
  distance: {type: [Number], index: '2dsphere'},
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

/**
 * Create mongoDB model
 */
mongoose.model('Location', locationSchema);


