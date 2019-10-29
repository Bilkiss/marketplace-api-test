var mongoose = require('mongoose');
var dbconfig = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var fs = require("fs");
var cloudinary = require("cloudinary");
var Property = require("../models/property");


cloudinary.config({
    cloud_name: '<cloudname>',
    api_key: '<apikey>',
    api_secret: '<apisecret>'
});

// Property list
router.get("/list", function (req, res) {

    Property.find().lean().exec(function (err, propertylist) {
    // console.log("propertylist : ", propertylist);
    if (err) return res.status(400).json({
      sucess: false,
      message: err
    });
    return res.status(200).json({
      success: true,
      data: propertylist
    });
  });

});


// Add a property
router.post("/add-property", async function (req, res) {

    let exist = await Property.find({
        "ref": req.body.ref
    }).lean().exec();

    if (exist.length > 0) {
        return res.status(400).json({
            error: "Property ref already exists"
        });
    }

    let propertyDetails = new Property(req.body);
    console.log("propertyDetails is", propertyDetails);
    propertyDetails.save(err => {
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

    let imageFile = req.files['image'];
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

// Property by slug
router.get("/:slug", async (req, res) => {
  let properties = await Property.find({
    slug: req.params.slug
  }).lean().exec();

  if (properties.length) {
    let property = properties[0];

    console.log('property.slug: ', property.slug);

    return res.status(200).json(property);
  }

  return res.status(404).json({
    message: "Property not found"
  });

});




// Seed property from property.json
router.get("/put/seed", function (req, res) {
    console.log('in seed property');
    let cats = fs.readFileSync("dbseed/property.json", "utf8");
    cats = JSON.parse(cats);


    Property.collection.insert(cats, function (err, docs) {
        if (err) return console.log(err);
        res.end();

    });

    console.log(cats);

});

module.exports = router;
