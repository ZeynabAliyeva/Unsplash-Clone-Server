const express = require("express");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/userRouter");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const http = require("http");
const server = http.createServer(app);

let privateKey = "ironmaidenironmaidenironmaidenironmaiden";

app.use((req, res, next) => {
  if (req.url == "/api/users/login" || req.url == "/api/users/confirmCode") {
    return next();
  }

  let auth = req.headers.authorization?.split(" ");
  let token = "";

  if (auth) {
    if (auth.length == 2) {
      token = auth[1];
    } else {
      res.status(401).json({ message: "Access Error!" });
    }
  } else {
    res.status(401).json({ message: "Access Error!" });
  }

  jwt.verify(token, privateKey, function (err, decode) {
    if (err) {
      res.status(401).json(err);
    } else {
      next();
    }
  });
});

mongoose
  .connect(
    "mongodb+srv://Zeynab:241761331z@cluster0.xtyohvz.mongodb.net/unsplash"
  )
  .then((res) => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Connection error!");
  });

app.use("/api/users", userRouter);

server.listen(8080, () => {
  console.log("listening on *:8080");
});
