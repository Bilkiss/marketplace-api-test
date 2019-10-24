var mongoose = require('mongoose');
var passport = require('passport');
var dbconfig = require('../config/database');
require('../config/passport')(passport);
var fs = require("fs");
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");


// Registration
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            success: false,
            msg: 'Please pass username and password.'
        });
    } else {

        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone
        });

        console.log('newUser: ', newUser);


        if (req.body.phone) newUser.phone = req.body.phone;
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'An error occured',
                    error: err
                });
            }
            res.json({
                success: true,
                msg: 'Registration successful!'
            });
        });
    }
});


// Sign in
router.post('/signin', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({
                success: false,
                msg: 'Authentication failed. User not found.'
            });
        } else {


            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), dbconfig.secret);
                    // return the information including token as JSON

                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: user.toJSON()
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
                }
            });
        }
    });
});

//Users list
// todo: protect
router.get("/list", function (req, res) {

    User.find().lean().exec(function (err, userlist) {
        // console.log("userlist : ", userlist);
        if (err) return res.status(400).json({
            sucess: false,
            message: err
        });
        return res.status(200).json({
            success: true,
            data: userlist
        });
    });

});

// Seed user from user.json
router.get("/seed-users", function (req, res) {
    let cats = fs.readFileSync("dbseed/users.json", "utf8");
    cats = JSON.parse(cats);


    User.collection.insert(cats, function (err, docs) {
        if (err) return console.log(err);
        res.end();

    });

    console.log(cats);

});

module.exports = router;
