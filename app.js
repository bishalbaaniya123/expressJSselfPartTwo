const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;
//Check Connection
db.once('open', function () {
    console.log("Connected to MongoDB");
});

//Check for db errors
db.on('error', function (err) {
    console.log(err)
});
//Init app
const app = express();

//Bring in models
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                title: 'Hello',
                articles: articles
            });
        }
    });
});
//Get Single Article
app.get('/article/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render("article", {
                article: article,
            });
        }
    });
});

//Add Route
app.get('/articles/add', function (req, res) {
    res.render("add_article", {
        title: 'Articles',
    });
});
//Add Submit POST route
app.post('/articles/add', function (req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});
//Start Server
app.listen(3001, function () {
    console.log("Server started on port 3001......");
});