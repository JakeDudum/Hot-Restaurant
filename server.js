// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var nodemailer = require("nodemailer");

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
    var email;

    for (var i = 0; i < tables.length; i++) {
        if (tables[i].id === id) {
            tables.splice(i, 1);
            if (waitlist.length != 0) {
                tables.push(waitlist[0]);
                email = waitlist[0].email;
                waitlist.splice(0,1);
            }
            break;
        }
    }
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main(){
    
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();
    
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass // generated ethereal password
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    main();
    
    main().catch(console.error);


    res.json(id);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
