const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const vstsClient = require("./vstsAPIClient");

const mongoose = require("mongoose");
mongoose.connect(process.env.mongoConnectionString);
const db = mongoose.connection;
const Commits = require("./models").Commits;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to the db");
});

app.get("/", (req, res) => {
  res.send("Delta API.");
});

app.get("/team-projects", (req, res) => {
  vstsClient.getAllTeamProjects().then(data => {
    res.send(data);
  });
});

app.get("/repositories", (req, res) => {
  vstsClient.getAllRepositories().then(data => {
    res.send(data);
  });
});

app.get("/commits", async (req, res) => {
  const commits = await vstsClient.getAllCommits().then(data => data);

  const newCommits = commits.map(
    commit =>
      new Commits({
        _id: commit.commitId,
        author: { name: commit.author.name, email: commit.author.email },
        changeCounts: {
          add: commit.changeCounts.Add,
          edit: commit.changeCounts.Edit,
          delete: commit.changeCounts.Delete
        }
      })
  );

  const updateOperations = newCommits.map(nc => ({
    updateOne: { filter: { _id: nc._id }, update: nc, upsert: true }
  }));

  const result = await Commits.collection
    .bulkWrite(updateOperations)
    .then(result => result);

  res.send(`${result.nUpserted}`);
});

app.timeout = 600000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
