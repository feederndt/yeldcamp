if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}

const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const routesCamp = require('./routes/campgroundsRoute');
const routesReview = require('./routes/reviewsRoutes');
const routesUser = require('./routes/userRoutes');
const User = require('./models/user');
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const app = express();
// 'mongodb://localhost:27017/Yelp-Camp'
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
      console.log("Connect to DB")
    });

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});


store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', routesUser);
app.use('/campgrounds', routesCamp);
app.use('/campgrounds/:r/review',routesReview);

//Home
app.get('/', (req, res) => {
    res.render('home')
})

//Function error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
//Middleware Errorhandle
app.use((err, req, res, next) => {
    const {message, statusCode = 500} = err
    if(!err.message)
    {
        err.message = 'Page not found'
    }
    res.status(statusCode).render('error',{err})
});



app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})