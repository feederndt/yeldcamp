const validationSchema = require('./validationSchema')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')

module.exports.IsLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first!')
    return res.redirect('/login')
  }
  next()
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = validationSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

module.exports.IsAuthor = async (req, res, next) => {
  const { r } = req.params
  const camp = await Campground.findById(r)
  if (!camp.author.equals(req.user.id)) {
    req.flash('error', 'You do not have the authority to do this')
    return res.redirect(`/campgrounds/${r}`)
  }
  next()
}
