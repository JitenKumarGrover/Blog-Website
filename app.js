//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Too young, too simple. Sometimes, naive & stupid.";
const aboutContent = "I am a Computer Engineering Student at Thapar Institute of Engineering And Technology Patiala, India. I am a passionate coder, and always looking for learning new technologies. I code to create new things and solve interesting problems. Loves to travel, reading books and listening music.";
const contactContent = "I’m currently available for freelance work.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", true);

mongoose.connect("mongodb+srv://jitengrover:test1402@cluster0.0u2ht.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
 };

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({}); // Use async/await instead of a callback
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about",function(req,res){
  res.render("about", { startingAboutContent: aboutContent});
  });

app.get("/contact",function(req,res){
  res.render("contact", { startingContactContent: contactContent});
  });

app.get("/compose",function(req,res){
  res.render("compose",);
  });

app.post("/compose", function(req,res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
