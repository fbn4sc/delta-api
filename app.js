const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const vstsClient = require("./vstsAPIClient");

const mongoose = require("mongoose");
mongoose.connect(process.env.mongoConnectionString);
const db = mongoose.connection;

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

app.get("/commits", (req, res) => {
  vstsClient.getAllCommits().then(data => {
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
