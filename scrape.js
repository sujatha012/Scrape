

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path')
var mongoose = require("mongoose");
var PORT = 3000;
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var req = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
var routes = require("./controllers/scrapeController.js");

app.use(routes);


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeBBCNews";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
