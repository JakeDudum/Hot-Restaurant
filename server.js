// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Table and Waitlist (DATA)

var tables = [];
var waitlist = [];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tables", function (req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reserve", function (req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
});

app.get("/api/tables", function (req, res) {
    return res.json(tables);
});

app.get("/api/waitlist", function (req, res) {
    return res.json(waitlist);
});

app.post("/api/reservations", function (req, res) {
    var newTable = req.body;

    if (tables.length < 5) {
        tables.push(newTable);
        console.log(newTable + " added to tables.");
    }
    else {
        waitlist.push(newTable);
        console.log(newTable + " added to waitlist.");
    }

    res.json(newTable);
});

app.delete("/api/reservations/:id", function (req, res) {
    var id = req.params.id;

    for (var i = 0; i < tables.length; i++) {
        if (tables[i].id === id) {
            tables.splice(i, 1);
            if (waitlist.length != 0) {
                tables.push(waitlist[0]);
                waitlist.splice(0,1);
            }
            break;
        }
    }

    res.json(id);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
