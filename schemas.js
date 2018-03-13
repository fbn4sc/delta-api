const mongoose = require("mongoose");

const CommitSchema = mongoose.Schema({
  _id: String,
  comment: String,
  commitDate: String,
  author: {
    name: String,
    email: String
  },
  changeCounts: {
    add: Number,
    edit: Number,
    delete: Number
  }
});

module.exports = {
  CommitSchema
};
