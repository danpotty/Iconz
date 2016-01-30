'use strict';
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Comment = mongoose.model('Comment');
let Icon = mongoose.model('Icon');
let User = mongoose.model('User');
let jwt = require('express-jwt');
let auth = jwt({
  userProperty: 'payload',
  secret: process.env.AUTH_SECRET
});

router.get('/:id', (req, res, next) => {
  Icon.findOne({ _id: req.params.id })
  .populate("comments")
  .exec((err, result) => {
    if(err) return next(err);
    if(!result) return next('Could not find that icon');
    res.send(result);
  });
});

router.post('/:id', auth, (req, res, next)=> {
  let comment = new Comment(req.body);
  comment.createdBy = req.payload._id;
  comment.icon = req.params.id;
  comment.save((err, result) => {
    if(err) return next(err);
    if(!result) return next('Could not process that comment');
    User.update({ _id : req.payload._id }, { $push: { comments: result._id }}, (err, user) => {
      if(err) return next(err);
      Icon.update({ _id : req.params.id }, { $push: { comments: result._id }, $inc : {"numComments":1} }, (err, icon) => {
        result.numComments++;
        if(err) return next(err);
        res.send(result);
      });
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Comment.remove({ _id : req.params.id }, (err, result) => {
    if(err) return next(err);
    Icon.findOneAndUpdate({ 'comments' : req.params.id }, { $pull : { comments : req.params.id }}, (err, result) => {
      if(err) return next(err);
      result.numComments--;
      result.save();
      User.findOneAndUpdate({ 'comments' : req.params.id }, { $pull : { comments : req.params.id }}, (err, result) => {
        if(err) return next(err);
        res.send(result);
      });
    });
  });
});

router.put('/:id', (req, res, next) => {
  if(!req.body.message) return next('Please enter a comment');
  console.log(req.params.id);
  Comment.update({ _id : req.params.id }, { message : req.body.message }, function(err, result) {
    if(err) return next(err);
    if(!result)return next('Comment not found');
    res.send(result);
  });
});

module.exports = router;
