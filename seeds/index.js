const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/Yelp-Camp');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
      console.log("Connect to DB")
    });

const sample = arr => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i= 0; i<50; i++)
    {
        const price = Math.floor(Math.random()*10 +20)
        const randomNum = Math.floor(Math.random()*1000)
        const c = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'nhu cc',
            author: '632139128b7a1ae1b4b3d8c6',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomNum].longitude,
                    cities[randomNum].latitude,
                ]
            },
            images: [
                {
                    path: 'https://res.cloudinary.com/thangmechanical/image/upload/v1663567211/YelpCamp/hihi_aqp205.jpg',
                    filename: 'YelpCamp/hihi_aqp205'
                },
                {
                    url: 'https://res.cloudinary.com/thangmechanical/image/upload/v1663567212/YelpCamp/images_nnsziu.jpg',
                    filename: 'YelpCamp/images_nnsziu'
                }
            ]
        })
        await c.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});