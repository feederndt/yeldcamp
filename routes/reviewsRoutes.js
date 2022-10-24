const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const {IsLogin} = require('../middware');
const reviewControl = require('../controllers/reviewControl');

//Post new review to campground
router.post('/', IsLogin, catchAsync(reviewControl.newReview));

//Delete a review
router.delete('/:id', IsLogin, catchAsync(reviewControl.deleteReview));

module.exports = router;