const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.newReview = async (req, res) => {
  const camp = await Campground.findById(req.params.r)
  const review = new Review(req.body.review)
  review.author = req.user.id
  camp.reviews.push(review)
  await review.save()
  await camp.save()
  req.flash('success', 'Success!!!')
  res.redirect(`/campgrounds/${camp.id}`)
}

module.exports.deleteReview = async (req, res) => {
  const camp = await Campground.findById(req.params.r)
  const review = await Review.findById(req.params.id)
  camp.reviews.splice(camp.reviews.indexOf(review._id), 1)
  await Review.findByIdAndRemove(req.params.id)
  await camp.save()
  req.flash('success', 'Done')
  res.redirect(`/campgrounds/${camp.id}`)
}
