var express = require("express");
var request = require("request");
var router = express.Router();
var cheerio = require("cheerio");

// Import the model (cat.js) to use its database functions.
var db = require("../models/dbModel.js");

// Create all our routes and set up logic within those routes where required.
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("http://www.bbc.com/", function (error, response, html) {
   // request.get("http://www.echojs.com/").on('response', function(response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $('li[class=media-list__item]').each(function(i, element) {
            // Save an empty result object
            var result = {};
console.log($(this));
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".media__title")
                .children("a")
                .text();
            result.link =$(this)
                .children(".media__title")
                .children("a")
                .attr("href");
            result.mediaImg =$(this)
                .children(".media__link")
                .attr("href");

            result.summary = $(this)
                .children('.media__summary').text();
            result.mediaTag=$(this)
                .children(".media__tag").text();
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
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {

});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
});




module.exports = router;