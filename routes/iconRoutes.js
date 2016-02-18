'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Icon = mongoose.model('Icon');
let User = mongoose.model('User');
let jwt = require('express-jwt');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.AUTH_SECRET
});

router.get('/', (req, res, next) => {
  Icon.find({})
  .populate("createdBy", "username")
  .sort("-dateCreated")
  .exec((err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

router.post('/', auth, (req, res, next) => {
  let icon = new Icon(req.body);
  icon.name = req.body.name.toUpperCase();
  console.log(icon.name);
  icon.createdBy = req.payload._id;
  icon.color = req.body.color;
  icon.likers.push('init');
  icon.save((err, result) => {
    if(err) return next(err);
    if(!result) return next("Could not create icon");
    User.update({ _id : req.payload._id }, { $push: { posts : result._id }}, (err, user) => {
      if(err) return next(err);
      if(!user) return next("Could not add icon to user model");
      res.send(result);
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Icon.remove({ _id : req.params.id }, (err, result) => {
    if (err) return next(err);
    User.findOneAndUpdate({ 'icons': req.params.id}, { $pull: { icons: req.params.id }}, (err, result) => {
      if(err) return next(err);
      res.send(result);
    });
  });
});

router.put('/:id', (req, res, next) => {
  Icon.update({ _id : req.params.id }, req.body, function(err, result) {
    if(err) return next(err);
    if(!result) return next('Icon not found');
    res.send(result);
  });
});

router.put('/like/:id', auth, (req, res, next) => {
  Icon.findOne({ _id : req.params.id }).exec((err, result) => {
    for (var i = 0; i < result.likers.length; i++) {
      if(result.likers[i] == req.payload._id) {
        return res.send(result);
      }
      else if((i + 1) >= result.likers.length) {
        result.likers.push(req.payload._id);
        result.likes++;
        result.save();
        return res.send(result);
      };
    };
  });
});




module.exports = router;
