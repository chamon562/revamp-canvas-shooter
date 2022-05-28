const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const scoreBoard = require("./routes/scoreBoard");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connecting mongoDB
// mongodb uri is secret key
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected to MongoDB at ${db.host}: ${db.port}`);
});
db.once("error", (error) => {
  console.log(`Database error\n${error}`);
});

app.use("/api/score", scoreBoard);

app.get("/", (req, res) => {
  res.send("Backend running for your score board");
});

const PORT = process.env.PORT;

app.listen(PORT || 8318, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
