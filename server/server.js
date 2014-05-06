// set up ======================================================================
var express  = require('express');
var bodyParser = require('body-parser');
var grunt  = require('grunt');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

// models ======================================================================
var Participant = require('./models/participant');
var Winner = require('./models/winner');

// configuration ===============================================================
mongoose.connect('mongodb://localhost:27017/rangular'); 	// connect to mongoDB database on modulus.io

app.use(bodyParser());

// routes ======================================================================
app.get('/api/participants', function (req, res) {
    Participant.find(function (err, participants) {
        if (err) {
            res.send(err)
        }
        res.json(participants);
    });
});

app.get('/api/winners', function (req, res) {
    Winner.find(function (err, winners) {
        if (err) {
            res.send(err)
        }
        res.json(winners);
    });
});



app.post('/api/winners', function (req, res) {
    console.log(req.body)
    Winner.create({
        name: req.body.name
    }, function (err, winner) {
        if (err) {
            res.send(err);
        }
        Winner.find(function (err, winners) {
            if (err) {
                res.send(err)
            }
            res.json(winners);
        });
    });

});

exports = module.exports = app;

