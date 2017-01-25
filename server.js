var express = require("express");
var bodyParser = require("body-parser");
// var router = require('./controllers/controller.js');
var methodOverride = require('method-override');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var User = require("./models/User.js");
var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");
var passport = require('passport');
var LocalStrategy= require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var session = require('express-session');
var app = express();
var PORT = process.env.PORT || 3000;
var index_routes = require('./routes/index');
// var auth_routes = require('./routes/auth');

mongoose.Promise = Promise;


// Setting up express
app.use(express.static("./public"));
app.use(methodOverride('_method'));
app.use('/', index_routes);
app.use(session({
    secret: "Thisismysecretsessionforusers!",
    resave: false,
    saveUninitialized: false
  }));

//Body-Parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user,done) {
  done(null, user.id);
});

passport.deserializeUser(function(id,done) {
  User.findById(id, function (err,user) {
    done(err,user);
  });
});

//Setting up handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Configuring protected_dust database
var databaseUri = "mongodb://localhost/protected_dust";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});



////////////////////////////
// Holding on to until Stormpath is figured out.....

// var strategy = new StormpathStrategy();
// passport.use(strategy);
// passport.serializeUser(strategy.serializeUser);
// passport.deserializeUser(strategy.deserializeUser);

// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   secret: process.env.EXPRESS_SECRET,
//   key: 'sid',
//   cookie: { secure: false },
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
