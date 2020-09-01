// import required items
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const knex = require("knex");
const config = require("./knexfile");
const bcrypt = require("bcryptjs");

// set up config
const server = express();
const upload = multer();
const db = knex(config.development);
const port = process.env.port || 8800;

// set up middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.array("uploadFile"));
server.use(express.static("public"));

// set cloudinary env variables
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// get all images
server.get("/lib", (req, res) => {
  db("Images")
    .select("*")
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// add a new image
server.post("/upload", (req, res) => {
  const img = req.files[0];
  // convert image to base64 string for upload
  const base64img = img.buffer.toString("base64");

  cloudinary.uploader.upload(
    `data:${img.mimetype};base64,${base64img}`,
    (error, result) => {
      if (error) {
        res.status(500).json({ error });
      } else {
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
              res.status(201).json({ newImg: newImg });
            }
          })
          .catch((err) => res.status(500).json({ error: err }));
      }
    }
  );
});

//create a new user
server.post("/register", (req, res) => {
  const { username, password } = req.body;

  // create password hash to be stored in db
  bcrypt.hash(password, 8).then((hashed) => {
    db("Users")
      .insert({ username: username, password: hashed })
      .then((data) => {
        res.status(201).json({ message: "success", data: data });
      })
      .catch((err) => console.error(err));
  });
});

// login route
server.post("/login", (req, res) => {
  const { username, password } = req.body;
  db("Users")
    .select("password")
    .where({ username: username })
    .first()
    .then((data) => {
      //compare submitted password with user's password hash
      if (data && bcrypt.compareSync(password, data.password)) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(200).json({ message: "fail" });
      }
    })
    .catch((err) => console.error(err));
});

// delete a given image id
server.delete("/delete/:id", (req, res) => {
  db("Images")
    .where({ id: req.params.id })
    .del()
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "success" });
    })
    .catch((err) => console.error(err));
});

// edit image info
server.put("/edit", (req, res) => {
  db("Images")
    .where({ id: req.body.id })
    .update({ description: req.body.description, name: req.body.name })
    .then(() => {
      res.status(200).json({ message: "success" });
    })
    .catch((err) => console.error(err));
});

server.listen(8800, () => {
  console.log(`=== Listening on port ${port} ===`);
});
