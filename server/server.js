var express = require("express");
var app = express();

var validator = require("../");

// Use build directory to serve static files
app.use(express.static("build"));

// Return client library
app.get("/uniform.js", function (req, res) {
    validator.getClientLib().then(function (lib) {
        res.end(lib);
    }, function (err) {
        res.status(500).end(err);
    });
});

// On car submission, validate and return whether or not it is valid
app.post("/examples/car/submit", validator("build/examples/car/car.ufm"), function (req, res) {
    res.status(200).end("Valid data!");
    console.log(req.ufmResult);
}, function (err, req, res, next) {
    res.status(400).end("Invalid data!");
    console.error(err);
});

// Listen on port given by environment
var port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log("Listening on port: " + port);
});
