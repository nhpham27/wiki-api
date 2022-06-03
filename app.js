const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", 'ejs');

// connect to mongodb server
mongoose.connect("mongodb://localhost:27017/wikiDB");

// create schema
const articlesSchema = {
    title: String,
    content: String
};

// create model
const Article = mongoose.model("Article", articlesSchema);

///// Request targeting all articles ///////
app.route("/articles")
    .get(function (req, res) { // get all articles
        Article.find({}, function (err, foundArticles) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(foundArticles);
            }
        })
    })
    .post(function (req, res) { // add new article
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article.");
            }
        });
    })
    .delete(function (req, res) { // delete article
        Article.deleteMany(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully delete articles.");
            }
        });
    });


///// Request targeting one article ///////
app.route("/articles/:articleTitle")
    .get(function (req, res) { // get an article
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (err) {
                res.send(err);
            }
            else {
                if (foundArticle) {
                    res.send(foundArticle);
                }
                else {
                    res.send("No article found.");
                }
            }
        })
    })
    .put(function (req, res) {
        res.send(Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err, foundValue) {
                if (err) {
                    res.send(err);
                }
            }
        ));
    })
    .patch(function (req, res) {
        res.send(Article.updateOne(
            { title: req.params.articleTitle },
            { $set: JSON.stringify(req.body) },
            function (err, foundValue) {
                if (err) {
                    res.send(err);
                }
            }
        ));
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err, foundArticle) {
                if(err){
                    res.send(err);
                } else {
                    res.send("Successfully delete article.");
                }
            }
        );
    });

// start server
app.listen(8000, function (param) {
    console.log("Server running on port 8000.");
});