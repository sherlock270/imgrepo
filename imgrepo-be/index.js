const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");

const server = express();
const upload = multer();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.array("uploadFile"));
server.use(express.static("public"));

server.post("/", (req, res) => {
  console.log(req.files);

  res.status(200).json({ message: "received a request" });
});

server.listen(8800, () => {
  console.log("Listening on port 8800");
});
