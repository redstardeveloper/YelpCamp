var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport   = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    flash      = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    User       = require('./models/user'),
    seedDB     = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.Promise = global.Promise;

var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
var promise = mongoose.connect(url, {
    useMongoClient: true,
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'Hello my friend, how are you?',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

//LOCALHOST
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log('Server has started on port ' + port );
});
