/*
 * Entry point for the api.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
app.use(bodyParser.json());

const passport = require('passport');
const dbconfig = require('./config/database');

const CarsRoute = require('./routes/cars');
const UsersRoute = require('./routes/users');


mongoose.connect(dbconfig.database, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(
  () => {
    console.log("db connection successful")
  },
  err => {
    console.log("db connection failed, " + err)
  }
);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, authorization, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  next();
});

app.use(express.static('static'));

app.use(passport.initialize());

app.use('/api/car', CarsRoute);
app.use('/api/user', UsersRoute);


let port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log(`Running... api is at http://localhost:${port}/api`);
});
