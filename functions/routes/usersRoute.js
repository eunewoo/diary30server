const { hashutil } = require("../middleware/hashuitl");
const express = require("express");
const router = express.Router();
const users = require("../models/users");
const { wrapAsync } = require("../utils/helper");
const UsersService = require("../services/usersService");

const usersService = new UsersService();

//get all user id to check for duplication in register page
//This should be fixed for security
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
    await usersService.addUser(newUser);
    res.json(newUser);
  })
);

router.post(
  "/users/login",
  wrapAsync(async function (req, res) {
    const { user_id, password } = req.body;

    const user = await usersService.getUserById(user_id);

    if (!user) {
      res.status(305).send("No user with id: " + user_id);
    } else {
      let reqHash = hashutil(user_id, user[0].user_email, password);

      if (reqHash === user[0].password) {
        console.log("sessionID", req.sessionID);
        req.session.sessionID = req.sessionID;

        req.session.userId = user[0]._id;
        req.cookies.cookieName = user[0]._id;

        console.log("req.session:");
        console.log(req.session);

        res.send("done");
        // res.status(201).json({ msg: "well sended!" });
      } else {
        res.sendStatus(401);
      }
    }
  })
);

//Change user profile in profile page
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
