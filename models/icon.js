"use strict";
let mongoose = require('mongoose');

let IconSchema = new mongoose.Schema({
  name: { type: String, require: true },
  color: {required: true, type: String},
  bgImg: {type: String},
  dateCreated: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likers: [],
  numComments: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Icon', IconSchema);
