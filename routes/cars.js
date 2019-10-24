var mongoose = require('mongoose');
var dbconfig = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var cloudinary = require("cloudinary");
var Car = require("../models/car");


cloudinary.config({
    cloud_name: '<cloudname>',
    api_key: '<apikey>',
    api_secret: '<apisecret>'
});

//car list
router.get("/list", function (req, res) {

    Car.find().lean().exec(function (err, carlist) {
    // console.log("carlist : ", carlist);
    if (err) return res.status(400).json({
      sucess: false,
      message: err
    });
    return res.status(200).json({
      success: true,
      data: carlist
    });
  });

});


//car by id
router.get("/:id", async (req, res) => {
  let cars = await Car.find({
    _id: req.params.id
  }).lean().exec();

  if (cars.length) {
    let car = cars[0];

    console.log('car._id: ', car._id);

    return res.status(200).json(car);
  }

  return res.status(404).json({
    message: "Car not found"
  });

});

// Add a car
router.post("/add-car", async function (req, res) {

    let exist = await Car.find({
        "ref": req.body.ref
    }).lean().exec();

    if (exist.length > 0) {
        return res.status(400).json({
            error: "Car ref already exists"
        });
    }

    let carDetails = new Car(req.body);
    console.log("carDetails is", carDetails);
    carDetails.save(err => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(200).json({
            success: true
        });
    });

});

// Upload image
router.post('/img-upload', function (req, res, next) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let imageFile = req.files['Image\n'];
    // let imageFile = req.files.image;
    console.log('imageFile: ', imageFile);
    console.log('imageFile: ', imageFile.name);
    let tmp_path = `./static/tmp/${imageFile.name}`;
    imageFile.mv(tmp_path, (err) => {
        if (err) {
            console.log('err: ', err);
            return res.status(500).send(err);
        }


        cloudinary.uploader.upload(tmp_path, (result) => {
            console.log("result after upload: ", result);
            return res.status(200).json(result);
        });
    });


    // cloudinary.image(result.public_id, {
    //   format: "png",
    //   width: 100,
    //   height: 130,
    //   crop: "fill"
    // })


});

// Seed car from car.json
router.get("/seed", function (req, res) {
    let cats = fs.readFileSync("dbseed/cars.json", "utf8");
    cats = JSON.parse(cats);


    Car.collection.insert(cats, function (err, docs) {
        if (err) return console.log(err);
        res.end();

    });

    console.log(cats);

});

module.exports = router;
