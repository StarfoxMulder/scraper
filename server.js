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

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});

// ////////////////////////////
// /////  Routes  \\\\\
// /////  ======  \\\\\

// // router.get("/home", function(req, res){
// //   res.render("home", {title: "Home", user: req.user});
// // });

// app.get("/", function(req,res) {
//   res.redirect('/login');
// })

// app.get("/register", function(req, res){
//   res.render("register");
// });

// app.post("/register", function(req, res) {
//   console.log("req.body.userName == "+req.body.userName);
//   console.log("req.body.email == "+req.body.email);
//   console.log("req.body.password == "+req.body.password);
//   User.register(new User({
//     userName: req.body.userName,
//     email: req.body.email,
//     password: req.body.password
//   }),

//   req.body.password, function(err, user){
//     if(err){
//       console.log(err);
//       return res.redirect("/error");
//     }
//     passport.authenticate("local")(req, res, function() {
//       res.redirect("/profile");
//     });
//   })
// });

// app.get("/login", function(req,res) {
//   res.render("login");
// });

// app.post("/login", passport.authenticate("local", {
//     failureRedirect: "/"
// }), function(req, res) {
//     reRoute(req,res);
// });

//     function isLoggedIn(req,res,next){
//       if(req.isAuthenticated()){
//         return next();
//       }
//       res.redirect("/");
//     }
//     function reRoute(req,res){
//       res.redirect("/profile");
//     }
//     function autoRedirect(req,res,next){
//       if(req.isAuthenticated()){
//         reRoute(req,res);
//       } else {
//         res.redirect("/error");
//       }
//     }



// app.get('/public', function(req, res){

//   Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
//     if(err) {
//     } else {
//       res.render("index",{found : found, title: "Public"});
//     }
//   });
// });

// app.get('/home', function(req, res){
//   Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
//     if(err) {
//     } else {
//       res.render("home",{found : found, title: "Home"});
//     }
//   });
// });

// app.get("/profile", function(req, res){

//   Article.find().sort({"saved": -1}).exec( function(err, found){
//     if(err) {
//     } else {
//       console.log(req.user);
//       console.log(res);
//       res.render("profile",{found : found, user: req.user});
//     }
//   });
// });

// app.get("/scrape", function(req, res) {
//   scrape();
// })


// app.get("/notes/:id", function(req, res) {

//   Article.findOne({"_id": req.params.id}).populate("notes").exec(function(err, article){
//       if(err) {
//         res.send(err);
//       } else {
//         res.send(article.notes);
//       };
//   });

// });
// // Create a new note or replace an existing note
// app.post("/notes/:id", function(req, res) {
//   if (res.status != 200) {
//     console.log(res);
//   }
//   var newNote = new Note(req.body);
//   // save the new note that gets posted to the Notes collection
//   newNote.save(function(err, note){
//     if(err) {
//       console.log(err);
//     } else {
//       Article.findOneAndUpdate({"_id" : req.params.id}, {$push: {notes:note}}, {safe: true, upsert: true})
//       .exec(function(err, article){
//           if(err) {
//             console.log(err);
//           } else {
//             res.redirect(req.originalUrl);
//         }
//         });
//       };
//     });
// });

// app.post("/save/:id", function(req, res) {
//   if (res.status != 200){
//     console.log(res)
//   } else {
//     Article.findOneAndUpdate({"_id": req.params.id}, {saved: true})
//     .exec(function(err, save) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect(req.originalUrl);
//       }
//     });
//   }
// });

// app.post("/delete/:id", function(req, res) {
//   Note.findByIdAndRemove(req.params.id, function(err, data){
//     if(err) {
//       console.log("delete err: ", err);
//     } else {
//       // res.redirect();
//     }
//   });
// });


// /* ////////////////////////
// A GET request to scrape the 5 websites: Vigilant Citizen, Above Top Secret, Cryptomundo, Paranormal News, and David Icke
// //////////////////////// */
// function scrape() {

//   //Scraping Vigilant Citizen
//   request("http://www.vigilantcitizen.com/", function(error, response, html) {

//     var $ = cheerio.load(html);

//     $("div.td-module-thumb").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children("a").attr("title");
//       result.link = $(this).children("a").attr("href");
//       result.image = $(this).children("a").children("img").attr("src");
//       result.source = vc;
//       result.scrapeDate = Date.now();

//       var entry = new Article(result);

//       entry.save(function(err, doc) {

//         if (err) {
//         }
//         else {
//         }
//       });
//     });

//   });

//   //Scraping Above Top Secret
//   request("http://www.abovetopsecret.com/", function(error, response, html) {

//     var $ = cheerio.load(html);

//     $("div.headline").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       result.image = "http://www.abovetopsecret.com/touch-icon-ipad-retina.png";
//       result.source = ats;

//       var entry = new Article(result);

//       entry.save(function(err, doc) {

//         if (err) {
//         }
//         else {
//         }
//       });
//     });

//   });

//   //Scraping Cryptomundo
//   request("http://cryptomundo.com/", function(error, response, html) {

//     var $ = cheerio.load(html);

//     $("p.highlight").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       result.image = "https://pbs.twimg.com/profile_images/1537474618/CM_logoSq.jpg";
//       result.source = cm;

//       var entry = new Article(result);

//       entry.save(function(err, doc) {

//         if (err) {
//         }
//         else {
//         }
//       });
//     });

//   });

//   //Scraping Paranormal News
//   request("https://www.paranormalnews.com/", function(error, response, html) {

//     var $ = cheerio.load(html);

//     $("div.listItemTitle").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       result.image = $(this).children("a").children("img").attr("src");
//       result.source = pn;

//       var entry = new Article(result);

//       entry.save(function(err, doc) {

//         if (err) {
//         }
//         else {
//         }
//       });
//     });

//   });

//   //Scraping David Icke
//   request("https://www.davidicke.com/headlines", function(error, response, html) {

//     var $ = cheerio.load(html);

//     $("h2.post-title").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children("a").text();
//       result.link = $(this).children("a").attr("href");
//       result.image = "http://cdn.images.express.co.uk/img/dynamic/1/285x214/211408_1.jpg";
//       result.source = di;

//       var entry = new Article(result);

//       entry.save(function(err, doc) {

//         if (err) {
//         }
//         else {
//         }
//       });
//     });

//   });

//   console.log("Scrape Complete");
// };

