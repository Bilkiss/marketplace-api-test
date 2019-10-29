var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertySchema = new Schema({
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
  price: {
    type: Number,
    required: false
  },
  image_property: {
    type: String,
    required: false
  },
});



module.exports = mongoose.model('Property', PropertySchema);
