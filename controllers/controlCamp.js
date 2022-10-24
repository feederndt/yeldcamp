const Campground = require('../models/campground')
const { cloudinary } = require('../cloundinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAP_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.newCampform = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.postnewCamp = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send()
  const camp = new Campground(req.body)
  camp.geometry = geoData.body.features[0].geometry
  if (camp.geometry.length == 0) {
    camp.geometry = [30.5, 50.5]
  }
  camp.author = req.user.id
  camp.images = req.files.map((x) => ({ path: x.path, filename: x.filename }))
  await camp.save()
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`/campgrounds/${camp.id}`)
}

module.exports.editCampform = async (req, res) => {
  const camp = await Campground.findById(req.params.r)
  if (!camp) {
    req.flash('error', 'Can not find')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp })
}

module.exports.updateCamp = async (req, res) => {
  const camp = await Campground.findByIdAndUpdate(req.params.r, req.body)
  const imgs = req.files.map((x) => ({ path: x.path, filename: x.filename }))
  camp.images.push(...imgs)
  if (req.body.deleteImage) {
    for (let filename of req.body.deleteImage) {
      cloudinary.uploader.destroy(filename)
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImage } } },
    })
  }
  await camp.save()
  req.flash('success', 'Successfully')
  res.redirect(`/campgrounds/${req.params.r}`)
}

module.exports.deleteCamp = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.r)
  res.redirect('/campgrounds')
}

module.exports.showCamp = async (req, res) => {
  const camp = await Campground.findById(req.params.r)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author')
  res.render('campgrounds/show', { camp })
}

module.exports.allCamp = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}
