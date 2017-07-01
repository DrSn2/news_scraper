/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
var store = [];
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/news_scraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

app.delete("/delete", function (req, res) {
  Article.deleteMany().exec(function (err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.json(doc);
      console.log("note deleted");
    }
  })
  Note.deleteMany().exec(function (err, doc) {

  })

})

app.delete("/articles2/:id", function (req, res) {


  // Article.update({"_id": req.params.id}, {$unset: {"notes":""}})
  // Article.findByIdAndRemove
  Article.deleteOne({ "_id": req.params.id })
    // .populate("note")
    // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.json(doc);
        console.log("note deleted");
      }
    })

})

// A GET request to scrape the echojs website
app.get("/scrape", function (req, res) {
  var obj = { title: "x" }
  var total = []
  total.push(obj)
  var counter = 0
    Article.find({}, function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
     total.push(doc);
    }
  });
  // First, we grab the body of the html with request
  request("https://www.nytimes.com/section/movies?action=click&contentCollection=arts&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:


    $("a.story-link").each(function (i, element) {


      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(this).attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)

      if (!total.includes(result.title)) {
        total.push(result.title)
        var entry = new Article(result);


        entry.save(function (err, doc) {


        })

      }

   
      // console.log(total)
    });
  
    // } //else  
  })  // each loop

  // Tell the browser that we finished scraping the text

  //       Article.find({}, function (error, doc) {
  //  res.send(doc)
// });
   console.log("Scrape Complete");
    })




// 2. This will get the articles we scraped from the mongoDB


app.get("/articles", function (req, res) {
  // window.location.reload();
  // Grab every doc in the Articles array
  Article.find({}, function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.send(doc);
    }
  });
});


// 3. Grab an article by it's ObjectId

app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});


// 4. Create a new note or replace an existing note


app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function (error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
        // Execute the above query
        .exec(function (err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            // Or send the document to the browser
            res.send(doc);
          }
        });
    }
  });
});


//5. delete all 



// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});