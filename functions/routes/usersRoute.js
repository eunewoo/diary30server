const express = require("express");
const router = express.Router();
const users = require("../models/users");
const { wrapAsync } = require("../utils/helper");
const usersService = require("../services/usersService");

//get all user id to check for duplication in register page
//This should be fixed for security
router.get(
  "/users",
  wrapAsync(async function (req, res) {
    const usersInstance = await users.find({});
    res.json(usersInstance);
  })
);

//get a user id from db when login
// router.get(
//   "/users/:user_id",
//   wrapAsync(async function (req, res) {
//     let idInstance = req.params.user_id;
//     const user = await users.find({ user_id: idInstance });

//     if (!user) {
//       res.status(404).send("No user with id: " + idInstance);
//     } else {
//       res.json(user);
//     }
//   })
// );
router.get(
  "/users/:user_id",
  wrapAsync(async function (req, res) {
    const idInstance = req.params.user_id;
    const user = await usersService.getUserById(idInstance);

    if (!user) {
      res.status(404).send("No user with id: " + idInstance);
    } else {
      res.json(user);
    }
  })
);

//post new user to db when registering
router.post(
  "/users",
  wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));

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
    // try {
    // } catch (error) {
    //   console.log("Error on Post: " + error.message);
    //   res.status(400);
    //   res.send(error.message);
    // }
  })
);

//Change user profile in profile page
router.put(
  "/api/users",
  wrapAsync(async function (req, res) {
    console.log("Put with body: " + JSON.stringify(req.body));

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
    // try {
    // } catch (error) {
    //   console.log("Error on Post: " + error.message);
    //   res.status(400);
    //   res.send(error.message);
    // }
  })
);

module.exports = router;
