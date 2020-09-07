// import required items
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const knex = require("knex");
const config = require("./knexfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// set up config
const server = express();
const upload = multer();
const db = knex(config[process.env.NODE_ENV]);
const port = process.env.PORT || 8800;

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
server.get("/", (req, res) => {
  res.status(200).json({ data: req.headers.token });
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
          name: req.body.name,
          description: req.body.description,
          user: "test user",
          img_url: result.secure_url,
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
        jwt.sign(
          { username: username },
          process.env.JWT_KEY,
          {
            expiresIn: "1 day",
          },
          (err, token) => {
            if (err) {
              res.status(400).json({ message: "fail", error: err });
            } else {
              res.status(201).json({ message: "success", token: token });
            }
          }
        );
      })
      .catch((err) => {
        res.status(403).json({ message: "fail", error: err });
      });
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
        jwt.sign(
          { username: username },
          process.env.JWT_KEY,
          {
            expiresIn: "1 day",
          },
          (err, token) => {
            if (err) {
              res.status(400).json({ message: "fail", error: err });
            }
            res.status(200).json({ message: "success", token: token });
          }
        );
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

server.listen(port, () => {
  console.log(`=== Listening on port ${port} ===`);
});

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_KEY);
}
