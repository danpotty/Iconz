"use strict";
let mongoose = require('mongoose');

let IconSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  bgImg: { type: String },
  dateCreated: { type: Date, default: Date.now },
  likers: [],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Icon', IconSchema);
