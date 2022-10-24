const mongoose = require('mongoose')
const Review = require('./review')

const opts = { toJSON: { virtuals: true } }

const ImageSchema = new mongoose.Schema({
  path: String,
  filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.path.replace('/upload', '/upload/w_250,h_250')
})

const CampgroundSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
)

CampgroundSchema.virtual('properties').get(function () {
  return {
    id: this.id,
    title: this.title,
  }
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    for (id of doc.reviews) {
      await Review.findByIdAndRemove(id)
    }
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
