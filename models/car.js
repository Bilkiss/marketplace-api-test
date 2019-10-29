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
  slug: {
    type: String
  },
  desc_excerpt: {
    type: String
  },
  description: {
    type: String
  },
  date_online: {
    type: String
  },
  date_offline: {
    type: String
  },
  currency: {
    type: String
  },
  contact_phone: {
    type: String
  },
  contact_email: {
    type: String
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
