require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const knex = require("knex");
const config = require("./knexfile");

const server = express();
const upload = multer();
const db = knex(config.development);

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
  db("Images")
    .select("*")
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

server.post("/upload", (req, res) => {
  const img = req.files[0];
  const base64img = img.buffer.toString("base64");
  console.log("img", img);

  cloudinary.uploader.upload(
    `data:${img.mimetype};base64,${base64img}`,
    (error, result) => {
      if (error) {
        console.log("error", error);
        res.status(500).json({ error });
      } else {
        console.log("inserting");
        let newImg = {
          name: img.originalname,
          description: "a test image",
          user: "test user",
          img_url: result.url,
        };
        db("Images")
          .insert(newImg)
          .then((result) => {
            if (result) {
              console.log("insertion result", result);
              res.status(201).json({ newImg: newImg });
            }
          })
          .catch((err) => res.status(500).json({ error: err }));
      }
    }
  );
});

server.listen(8800, () => {
  console.log("Listening on port 8800");
});
