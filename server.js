var express = require("express");
var stormpath = require('express-stormpath');
var bodyParser = require("body-parser");
// var router = require('./controllers/controller.js');
var methodOverride = require('method-override');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var flash = require('connect-flash');
var vc = "Vigilant Citizen";
var ats = "Above Top Secret";
var cm = "Cryptomundo";
var pn = "Paranormal News";
var di = "David Icke";
var currentArticle = "default";
// var up = "The Unbelievable Podcast";

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Setting up morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

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

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Stormpath needs to be the final initialized middleware before custom routes begin
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.EXPRESS_SECRET,
  key: 'sid',
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var index_routes = require('./routes/index');
var auth_routes = require('./routes/auth');
app.use('/', index_routes);
app.use('/', auth_routes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("App running on port "+ port);
});

app.on('stormpath.ready', function() {
  app.listen(3000);
});

/////  Routes  \\\\\
/////  ======  \\\\\
/*/////
  The scrape will run on server start and hitting "/",
  pushing all new articles to the db with a "source" field
  associated to where each article was sourced.
/////*/



/* alt handlebars instantiation
//////////////
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.handlebars'}));
app.set('view engine', 'handlebars');
*/

/* Moving toward a single page for all results
//// After talking with intended users, this is what they want
// Above Top Secret ajax
app.get("/abovetopsecret", function(req, res){
  Article.find({"source":ats}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      // res.send(index.html);
    }
  })
});
// Cryptomundo ajax
app.get("/cryptomundo", function(req, res){
  Article.find({"source":cm}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      // res.send(index.html);
    }
  })
});
// Paranormal News ajax
app.get("/paranormalnews", function(req, res){
  Article.find({"source":pn}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      // res.send(index.html);
    }
  })
});
// David Icke ajax
app.get("/davidicke", function(req, res){
  Article.find({"source":di}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      // res.send(index.html);
    }
  })
});
*/
