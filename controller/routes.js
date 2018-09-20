//DEPENDENCIES
const express    = require("express");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const cheerio    = require("cheerio");  
const request    = require("request-promise");
const mongoose   = require("mongoose");
const Model      = require("../models/model.js");

const app = express(); 
mongoose.Promise = Promise; 

app.get('/', (req, res) => {
    
    request("https://www.nytimes.com/", (error, response, html) => {
        var $ = cheerio.load(html);
        var results = [];                                                                                                                                  

        $("article.story.theme-summary").each( (i, element) => {

            let headline = $(element).children("h2.story-heading").text();
            let summary  = ($(element).children("p.summary").text() == "")? $(element).children("ul").text() : $(element).children("p.summary").text()
            let url      = $(element).children("h2.story-heading").children("a").attr("href");

            results.push({ headline: headline.trim(), summary: summary.trim(), url: url });
        });

        
        results.length = 7;

        results.forEach( result => {
            Model.find({headline: result.headline.toString()}, (err, data) => {
                if (err) return handleError(err);
                if (data == "" && result.headline !== "")
                    Model.create({headline: result.headline.toString(), summary: result.summary.toString(), url: result.url.toString()});
            });
        });

       
        Model.find({}, (err, data) => {
            if (err) return handleError(err);
            results = []; 
            results = data.reverse(); 
            res.render("index", {results});
        });
    });
});


app.get('/saved', (req, res) => {
    
    Model.find({saved: true}, (err, data) => {
        if (err) return handleError(err);
        results = []; 
        results = data; 
        res.render("saved", {results}); 
    });
});


app.get('/notes:id', (req, res) => {
    Model.findById({_id: req.params.id}, (err, article) => { res.json(article); });
});


app.post('/comment', (req, res) => {
    
    let commentData = {comment: req.body.comment};

   
    Model.updateOne({_id: req.body.id}, {$push: {comments: commentData}}).exec((err,result) => {
        if (err) throw err;
    });
});


app.put('/save:id', (req, res) => {
    let id = req.params.id;
    Model.findByIdAndUpdate({ _id: id }, { saved: true }, (err, result) => {
        if (err) throw err;
    });
});


app.put('/remove:id', (req, res) => {
    let id = req.params.id;
    Model.findByIdAndUpdate({ _id: id }, { saved: false }, (err, result) => {
        if (err) throw err;
    });
});


module.exports = app; 