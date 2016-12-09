var express = require("express");
var bodyParser = require("body-parser");
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
var up = "The Unbelievable Podcast";

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Setting up morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

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


// Routes
// ======

app.get("/", function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the 5 websites: Vigilant Citizen, Above Top Secret,
//   Cryptomundo, Paranormal News, and David Icke
app.get("/scrape", function(req, res) {

  //Scraping Vigilant Citizen
  request("http://www.vigilantcitizen.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    // The content we need is located within div.td-module-thumb
    $("div.td-module-thumb").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");
      result.source = vc;
      result.scrapeDate = Date.now();

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
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
      result.source = ats;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
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
      result.source = cm;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
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
      result.source = pn;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
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
      result.source = di;

      var entry = new Article(result);

      // Saving this instance of the Article model with
      //  scraped article title and url to the db
      entry.save(function(err, doc) {

        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
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
  res.send("Scrape Complete");

});

/*/////
  The scrape will run on page load, pushing all new articles to the db with a field
    associating with source they are from.  The routes for each of the sources will
    render that source's most recent content into the articles ul via a route like this
    db.articles.find({"source":"vigcitizen"}).sort({"scrapeDate": -1})
    res.render('vigcitizen', {"source": "vigcitizen"})
/////*/

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  Article.find({}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      res.json(found)
    }
  })
});

app.get("/", function(req, res) {
  res.send(index.html);
});
// Testing basic format with vc MVC
app.get("/vigilantcitizen", function(req, res){
  Article.find({"source":vc}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      res.send(index.html);
    }
  })
});
// Above Top Secret ajax
app.get("/abovetopsecret", function(req, res){
  Article.find({"source":ats}, function(err, found){
    if(err) {
      console.log(err);
    } else {
      console.log(found);
      res.json(found);
      res.send(index.html);
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
      res.send(index.html);
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
      res.send(index.html);
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
      res.send(index.html);
    }
  })
});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Finish the route so it finds one article using the req.params.id,

  Article.findOne({"_id": req.params.id}).populate("note").exec(function(err, found){
      if(err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(found);
        res.send(found);
      }
  });
  // and run the populate method with "note",

  // then responds with the article with the note included
});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  // save the new note that gets posted to the Notes collection
  newNote.save(function(err, doc){
    if(err) {
      res.send(err);
    } else {
      Article.findOneAndUpdate({"_id": req.params.id}, {"note":doc._id})
      .exec(function(err, doc){
        if(err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      });
    }
  });
  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
