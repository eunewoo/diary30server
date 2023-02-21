const express = require("express");
const router = express.Router();
const users = require("../models/users");
//const { wrapAsync } = require("../utils/helper");

router.get("/users", async function (req, res) {
  console.log("USER REQUEST");
  const usersInstance = await users.find({});
  res.json(usersInstance);
});

//get a user id from db
router.get("/users/:user_id", async function (req, res) {
  let idInstance = req.params.user_id;
  const user = await users.find({ user_id: idInstance });

  if (user == undefined) {
    res.send("No user with id: " + idInstance);
    console.log("No user with id: " + idInstance);
  } else {
    res.json(user);
  }
});

//
router.post("/users", async function (req, res) {
  console.log("Posted with body: " + JSON.stringify(req.body));

  try {
    const newUser = new users({
      user_id: req.body.user_id,
      password: req.body.password,
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      address_f: req.body.address_f,
      address_l: req.body.address_l,
      img: req.body.img,
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.log("Error on Post: " + error.message);
    res.status(400);
    res.send(error.message);
  }
});

router.put("/api/users", async function (req, res) {
  console.log("Put with body: " + JSON.stringify(req.body));

  try {
    const userId = req.body.user_id;
    const newUser = {
      user_id: req.body.user_id,
      password: req.body.password,
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      address_f: req.body.address_f,
      adress_l: req.body.address_l,
      img: req.body.img,
    };
    await users.updateOne({ user_id: userId }, newUser);
    res.json(newUser);
  } catch (error) {
    console.log("Error on Post: " + error.message);
    res.status(400);
    res.send(error.message);
  }
});

module.exports = router;
