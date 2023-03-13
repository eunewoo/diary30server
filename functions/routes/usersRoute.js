const { hashutil } = require("../middleware/hashuitl");
const express = require("express");
const router = express.Router();
const users = require("../models/users");
const { wrapAsync } = require("../utils/helper");
const UsersService = require("../services/usersService");

const usersService = new UsersService();

// GET all user id to check for duplication in register page
// For security, code is changed from sending all user data to only send user_id
router.get(
  "/users",
  wrapAsync(async function (req, res) {
    const usersInstance = await usersService.getAllUsers();
    const usersIdArray = [];
    for (let i in usersInstance) {
      usersIdArray.push(usersInstance[i].user_id);
    }
    console.log("usersIdArray", usersIdArray);
    res.json(usersIdArray);
  })
);

// GET user id using user_id
// This runs when the specific user's login process is completed
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

// POST new user to db when registering
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
    await usersService.addUser(newUser);
    res.json(newUser);
  })
);

// When user click login button,
// POST questions by saving user's data as session when login is succeeded
// Changed part is: adapted session for better security
// Make user_id&passsword hash from client side to backend
// But not adapted in deployed version yet

// router.post(
//   "/users/login",
//   wrapAsync(async function (req, res) {
//     const { user_id, password } = req.body;

//     console.log("reqID", user_id);

//     const user = await usersService.getUserById(user_id);

//     console.log("user", user);

//     if (!user) {
//       res.status(404).send("No user with id: " + user_id);
//     } else {
//       let reqHash = hashutil(user_id, user[0].user_email, password);

//       console.log("reqhash", reqHash);
//       console.log("hash", user[0].password);

//       if (reqHash === user[0].password) {
//         req.session.userId = user._id;
//         res.sendStatus(204);
//       } else {
//         res.sendStatus(401);
//       }
//     }
//   })
// );

// Change user profile in profile page
router.put(
  "/users",
  wrapAsync(async function (req, res) {
    console.log("Put with body: " + JSON.stringify(req.body));

    const userId = req.body.user_ref;
    const newUser = {
      user_id: req.body.user_id,
      password: req.body.password,
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      address_f: req.body.address_f,
      address_l: req.body.address_l,
      img: req.body.img,
    };
    await usersService.updateUser(userId, newUser);
    res.json(newUser);
  })
);

module.exports = router;
