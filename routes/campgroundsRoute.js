const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {IsLogin, validateCampground, IsAuthor} = require('../middware');
const campControl = require('../controllers/controlCamp');
const {storage} = require('../cloundinary/index');
const multer  = require('multer');
const upload = multer({ storage });



//Form to add new campground
router.get('/new', IsLogin, campControl.newCampform );
//Post new campground to DB
router.post('/', IsLogin, upload.array('image'), validateCampground, catchAsync(campControl.postnewCamp));
//Form to edit and update campground
router.get('/:r/edit',IsLogin, IsAuthor, catchAsync(campControl.editCampform));
//Update campground
router.put('/:r', IsLogin, IsAuthor, upload.array('image'), validateCampground, catchAsync(campControl.updateCamp));
//Delete campground
router.delete('/:r',IsLogin, IsAuthor, catchAsync(campControl.deleteCamp));
//Show details campground
router.get('/:r',IsLogin, catchAsync(campControl.showCamp));
//Show all Campgrounds
router.get('/', catchAsync(campControl.allCamp));

module.exports = router;