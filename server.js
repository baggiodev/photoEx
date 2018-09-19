// Web Scraper Homework Solution Example
// (be sure to watch the video to see
// how to operate the site in the browser)
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var multer = require("multer");
var Photo = require("./models/pictures.js");
var storage = multer.diskStorage({
    destination:  function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req,file,cb) => {
    //reject file
    if(file.mimetype === "/image/jpeg" || file.mimetype === "image/png"){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
var upload = multer({
    storage:storage,
    limits:{
        fileSize:1024 * 1024 * 10
    }
})

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();


// Designate our public folder as a static directory
app.use(express.static("public"));
app.use("/uploads",express.static("uploads"));
// Use bodyParser in our app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Have every request go through our route middleware

app.get("/",function(req,res){
    res.send("public/index.html")
})
app.get("/baggio",function(req,res){
    res.sendFile(path.join(__dirname, "./public/baggio.jpg"));
})
app.post("/photo",upload.single("pic"),function(req,res){
    console.log(req.file);
    const photo = new Photo({
        _id: new mongoose.Types.ObjectId(),
        imageURL: req.file.path
    })
    photo.save()
    .then(result =>{
        console.log(result);
        res.send(201);
    })
})
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/photos";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
