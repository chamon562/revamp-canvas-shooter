require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models/score");

router.get("/", (req, res) => {
  res.send("scoreboard");
});

// create a user with score
router.post("/score-board", (req, res) => {
  db.find({ user: req.body.name }).then((player) => {
    if (!player) {
      return res.status(400).json("User doesnt exist");
    } else {
      const newPlayer = new db({
        name: req.body.name,
        score: req.body.score,
      });
      // save the player
      newPlayer
        .save()
        .then((createdPlayer) => res.json(createdPlayer))
        .catch((error) => {
          if (error) {
            return res.status(400).send({
              message: "Someone has already used that name",
            });
          }
        });
    }
  });
});

// router.get("/all-players", (req, res) => {
//   db.find({}, function (err, users) {
//     if (err) {
//       res.send("something went wrong");
//       next();
//     }
//     res.send(users);
//   });
// });
router.get("/all-players", (req, res) => {
  db.find({}, (err, users) => {
    if (err) {
      res.send("something went wrong");
      next();
    }
    res.send(users);
  }).sort({ score: -1 }).limit(10);
});

module.exports = router;
