var express = require("express");
var request = require("request");
var router = express.Router();
var cheerio = require("cheerio");

// Import the model (cat.js) to use its database functions.
var db = require("../models/dbModel.js");
router.get("/", function(req, res) {
    res.redirect("/scrape");
} );
// Create all our routes and set up logic within those routes where required.
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("http://www.bbc.com", function (error, response, html) {
   // request.get("http://www.echojs.com/").on('response', function(response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $('.media-list__item').each(function(i, element) {
            // Save an empty result object
            console.log("I " + i)
            var $1 = cheerio.load($(this).html());
            var imgSrc = $1('div div div div img').attr('src');
            console.log(imgSrc.search(/data:image/));

            if(imgSrc.search(/data:image/) !== -1)
            {
               // result.mediaImg="";
            }
            else{

             console.log($1('div div h3 a').text());
             console.log($1('div div h3 a').attr('href'));
             console.log($1('div div div div img ').attr('src'));
            console.log($1('div div div div').html());
//             console.log($1('div a').filter('.media__link').text());
//             console.log($1('div p').filter('.media__summary').text());
             console.log($1('div div a').filter('.media__tag').text());
             var result = {};
//
// //console.log($1('div h3 a .media__link').html());
//             // Add the text and href of every link, and save them as properties of the result object
            result.title = $1('div div h3 a').text().trim();
            result.link =$1('div div h3 a').attr('href');
                result.mediaImg =imgSrc;

            result.mediaTag=$1('div div a').filter('.media__tag').text();
             console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    console.log(err);

                 //   return res.json(err);
                });
                }
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.render("index");
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.delete("/articles", function(req, res){
   db.Article.deleteMany({}, function(err, results){
       console.log("Articles : " +  results.result);
   })
    db.Note.deleteMany({}, function(err, results){
        console.log("Notes : " +results.result);
    })
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry

    db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// Route for grabbing a specific Article by id, populate it with it's note
router.get("/notes", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Note.find({})
    // ..and populate all of the notes associated with it

        .then(function(dbNote) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbNote);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


module.exports = router;