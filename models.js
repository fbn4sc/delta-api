const mongoose = require("mongoose");
const CommitSchema = require("./schemas").CommitSchema;

const Commits = mongoose.model("Commits", CommitSchema);

module.exports = {
  Commits
};
