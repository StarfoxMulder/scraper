var express = require("express");
var router = express.Router();
var app = express();
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var User = require("../models/User.js");
var passport = require('passport');
var LocalStrategy= require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var session = require('express-session');
var logger = require("morgan");
var request = require("request");
var cheerio = require("cheerio");
var vc = "Vigilant Citizen";
var ats = "Above Top Secret";
var cm = "Cryptomundo";
var pn = "Paranormal News";
var di = "David Icke";
var currentArticle = "default";
// var up = "The Unbelievable Podcast";

/////  Routes  \\\\\
/////  ======  \\\\\

// router.get("/home", function(req, res){
//   res.render("home", {title: "Home", user: req.user});
// });

router.get("/", function(req,res) {
  res.redirect('/login');
})

router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res) {
  console.log("req.body.userName == "+req.body.userName);
  console.log("req.body.email == "+req.body.email);
  console.log("req.body.password == "+req.body.password);
  User.register(new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password
  }),

  req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.redirect("/error");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/");
    });
  })
});

router.get("/login", function(req,res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/"
}), function(req, res) {
    reRoute(req,res);
});

    function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect("/");
    }
    function reRoute(req,res){
      res.redirect("/profile");
    }
    function autoRedirect(req,res,next){
      if(req.isAuthenticated()){
        reRoute(req,res);
      } else {
        res.redirect("/error");
      }
    }



router.get('/public', function(req, res){

  Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
    if(err) {
    } else {
      res.render("index",{found : found, title: "Public"});
    }
  });
});

router.get('/home', function(req, res){
  Article.find().sort({"scrapeDate":-1}).exec( function(err, found){
    if(err) {
    } else {
      res.render("home",{found : found, title: "Home"});
    }
  });
});

router.get("/profile", function(req, res){

  Article.find().sort({"saved": -1}).exec( function(err, found){
    if(err) {
    } else {
      console.log(req.user);
      console.log(res);
      res.render("profile",{found : found, user: req.user});
    }
  });
});

router.get("/scrape", function(req, res) {
  scrape();
})


router.get("/notes/:id", function(req, res) {

  Article.findOne({"_id": req.params.id}).populate("notes").exec(function(err, article){
      if(err) {
        res.send(err);
      } else {
        res.send(article.notes);
      };
  });

});
// Create a new note or replace an existing note
router.post("/notes/:id", function(req, res) {
  if (res.status != 200) {
    console.log(res);
  }
  var newNote = new Note(req.body);
  // save the new note that gets posted to the Notes collection
  newNote.save(function(err, note){
    if(err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate({"_id" : req.params.id}, {$push: {notes:note}}, {safe: true, upsert: true})
      .exec(function(err, article){
          if(err) {
            console.log(err);
          } else {
            res.redirect(req.originalUrl);
        }
        });
      };
    });
});

router.post("/save/:id", function(req, res) {
  if (res.status != 200){
    console.log(res)
  } else {
    Article.findOneAndUpdate({"_id": req.params.id}, {saved: true})
    .exec(function(err, save) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(req.originalUrl);
      }
    });
  }
});

router.post("/delete/:id", function(req, res) {
  Note.findByIdAndRemove(req.params.id, function(err, data){
    if(err) {
      console.log("delete err: ", err);
    } else {
      // res.redirect();
    }
  });
});

module.exports = router;

/* ////////////////////////
A GET request to scrape the 5 websites: Vigilant Citizen, Above Top Secret, Cryptomundo, Paranormal News, and David Icke
//////////////////////// */
function scrape() {

  //Scraping Vigilant Citizen
  request("http://www.vigilantcitizen.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("div.td-module-thumb").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a").children("img").attr("src");
      result.source = vc;
      result.scrapeDate = Date.now();

      var entry = new Article(result);

      entry.save(function(err, doc) {

        if (err) {
        }
        else {
        }
      });
    });

  });

  //Scraping Above Top Secret
  request("http://www.abovetopsecret.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("div.headline").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "http://www.abovetopsecret.com/touch-icon-ipad-retina.png";
      result.source = ats;

      var entry = new Article(result);

      entry.save(function(err, doc) {

        if (err) {
        }
        else {
        }
      });
    });

  });

  //Scraping Cryptomundo
  request("http://cryptomundo.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("p.highlight").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "https://pbs.twimg.com/profile_images/1537474618/CM_logoSq.jpg";
      result.source = cm;

      var entry = new Article(result);

      entry.save(function(err, doc) {

        if (err) {
        }
        else {
        }
      });
    });

  });

  //Scraping Paranormal News
  request("https://www.paranormalnews.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("div.listItemTitle").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a").children("img").attr("src");
      result.source = pn;

      var entry = new Article(result);

      entry.save(function(err, doc) {

        if (err) {
        }
        else {
        }
      });
    });

  });

  //Scraping David Icke
  request("https://www.davidicke.com/headlines", function(error, response, html) {

    var $ = cheerio.load(html);

    $("h2.post-title").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "http://cdn.images.express.co.uk/img/dynamic/1/285x214/211408_1.jpg";
      result.source = di;

      var entry = new Article(result);

      entry.save(function(err, doc) {

        if (err) {
        }
        else {
        }
      });
    });

  });

  console.log("Scrape Complete");
};

