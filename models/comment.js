"use strict";
let mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
  message: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  likers: [],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  icon: { type: mongoose.Schema.Types.ObjectId, ref: 'Icon' }
});

module.exports = mongoose.model('Comment', CommentSchema);
