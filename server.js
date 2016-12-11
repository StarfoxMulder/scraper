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
var request = require("request");
var cheerio = require("cheerio");
var Promise = require("bluebird");
var vc = "Vigilant Citizen";
var ats = "Above Top Secret";
var cm = "Cryptomundo";
var pn = "Paranormal News";
var di = "David Icke";
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

//Setting up handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Configuring protected_dust database
mongoose.connect("mongodb://localhost/protected_dust");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


/////  Routes  \\\\\
/////  ======  \\\\\
/*/////
  The scrape will run on server start and hitting "/",
  pushing all new articles to the db with a "source" field
  associated to where each article was sourced.
/////*/
scrape();

app.get("/", function(req, res) {
  scrape();
  res.redirect("/vigilantcitizen");
});

// Testing basic format with vc MVC
app.get("/vigilantcitizen", function(req, res){

  Article.find()
  .sort({scrapeDate:-1})
  .exec(function(err, found){
    if(err) {
      console.log("Ghostbusters: "+err);
    } else {
      console.log("Ghostbusters");
      res.render("index",{found});
    }
  });

});

/////////////// SMALL TEST  \\\\\\\\\\\\\
////  Just with vigilantcitizen data  \\\\
// This will grab an article by it's ObjectId
app.get("/vigilantcitizen/:id", function(req, res) {

  Article.findOne({"_id": req.params.id}).populate("notes").exec(function(err, found){
      if(err) {
        console.log("GET /:id err");
        res.send(err);
      } else {
        console.log("GET /:id found");
        res.json(found);
      }
  });

});
// Create a new note or replace an existing note
app.post("/vigilantcitizen/:id", function(req, res) {

  var newNote = new Note(req.body);
  // save the new note that gets posted to the Notes collection
  newNote.save(function(err, doc){
    if(err) {
      console.log("POST /:id err");
    } else {
      Article.findOneAndUpdate({"_id": req.params.id}, {"note":doc._id})
      .exec(function(err, doc){
        if(err) {
          console.log("POST /:id db res err");
        } else {
          res.send(doc);
        }
      });
    }
  });

});

// A GET request to scrape the 5 websites: Vigilant Citizen, Above Top Secret,
//   Cryptomundo, Paranormal News, and David Icke
function scrape() {

  //Scraping Vigilant Citizen
  request("http://www.vigilantcitizen.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.td-module-thumb").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a img").attr("src");
      result.source = vc;
      result.scrapeDate = Date.now();

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log("turn on vc err");
        }
        else {
          console.log("vc worked");
        }
      });
    });

  });

  //Scraping Above Top Secret
  request("http://www.abovetopsecret.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.headline").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "http://files.abovetopsecret.com/images/menulogoB.png";
      result.source = ats;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log("turn on ats err");
        }
        else {
          console.log("ats worked");
        }
      });
    });

  });

  //Scraping Cryptomundo
  //// If a url does not have www. sould this be included? check docs
  request("http://cryptomundo.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("p.highlight").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = "https://pbs.twimg.com/profile_images/1537474618/CM_logoSq.jpg";
      result.source = cm;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log("turn on cm err");
        }
        else {
          console.log("cm worked");
        }
      });
    });

  });

  //Scraping Paranormal News
  request("https://www.paranormalnews.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.listItemTitle").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a img").attr("src");
      result.source = pn;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log("turn on pn err");
        }
        else {
          console.log("pn worked");
        }
      });
    });

  });

  //Scraping David Icke
  request("https://www.davidicke.com/headlines", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("h2.post-title").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.image = $(this).children("a img").attr("src");
      result.source = di;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log("turn on di err");
        }
        else {
          console.log("di worked");
        }
      });
    });

  });

  // Attempting to do the same with Unbelievable Podcast archives
  // request("https://www.spreaker.com/show/the-unbelievable-podcast", function(error, response, html) {

  //   var $ = cheerio.load(html);
  //   // The content we need is located within div.td-module-thumb
  //   $("div.epl_ep_title").each(function(i, element) {

  //     var result = {};

  //     result.title = $(this).children("a").attr("title");
  //     result.link = $(this).children("a").attr("href");
  //     result.source = up;

  //     var entry = new Article(result);

  //     // Saving this instance of the Article model with
  //     //  scraped article title and url to the db
  //     entry.save(function(err, doc) {

  //       if (err) {
  //         console.log(err);
  //       }
  //       else {
  //         console.log(doc);
  //       }
  //     });
  //   });

  // });
  // Tell the browser that we finished scraping the text
  console.log("Scrape Complete");
};

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

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
