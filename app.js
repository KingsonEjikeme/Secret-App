//jshint esversion:6
const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require("dotenv").config();

const app = express();

app.set("view engine", 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

let secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, excludeFromEncryption: ["email"]});

const User = new mongoose.model("User", userSchema);




app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});
app.post("/register", function(req, res){
  const username = req.body.username;
  const password = req.body.password;


  console.log(req.body.username + " " + req.body.password);

  const newUser = new User({
    email: username,
    password: password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err.message);
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, result){
    if(result){
      if(result.password === password){
        res.send("Authentication Complete");
      }else{
        res.send("Invalid Password");
      }
    }else{
      res.send("Enter a registered email.");
    }

  })

  //res.render("secrets");
});



app.listen(3000, function(err){
  if(!err){
    console.log("Successfully started server at port 3000");
  }else{
    console.log(err.message);
  }
});
