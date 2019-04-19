const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dreamSchema = new Schema({
  title:{
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }]
}, {timestamps: true});

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  lastViewedIndex: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const Dream = mongoose.model('Dream', dreamSchema);
const Image = mongoose.model('Image', imageSchema);

module.exports = {
  Dream,
  Image,
};
