require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const server = express();
const upload = multer();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.array("uploadFile"));
server.use(express.static("public"));

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

server.get("/lib", (req, res) => {
  res.status(200).json({
    images: [
      "http://res.cloudinary.com/dalvqmups/image/upload/v1598765845/u8ctbaigtgay9wkxkeyg.jpg",
    ],
  });
});

server.post("/upload", (req, res) => {
  const img = req.files[0];
  const base64img = img.buffer.toString("base64");

  cloudinary.uploader.upload(
    `data:${img.mimetype};base64,${base64img}`,
    (error, result) => {
      if (error) {
        console.log("error", error);
        res.status(500).json({ error });
      } else {
        res.status(201).json({ message: "received a request", result });
      }
    }
  );
});

server.listen(8800, () => {
  console.log("Listening on port 8800");
});
