var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarsSchema = new Schema({
  ref: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  body_type: {
    type: String,
    unique: false,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  mileage: {
    type: String,
    required: false
  },
  fuel_type: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  door_count: {
    type: String,
    required: true
  },
  image_car: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  }
});



module.exports = mongoose.model('Cars', CarsSchema);
