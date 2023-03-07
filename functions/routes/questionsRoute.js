const express = require("express");
const router = express.Router();
const questions = require("../models/questions");
const { isAgent } = require("../middleware/auth");
const { wrapAsync } = require("../utils/helper");

router.post("/questions", async function (req, res) {
  console.log("Posted with body: " + JSON.stringify(req.body));

  try {
    if (req.body.question_type === "multiple choice") {
      const newQuestion = new questions({
        user_id: req.body.user_id,
        question: req.body.question,
        question_selection: req.body.question_selection,
        question_type: req.body.question_type,
        question_order: req.body.question_order,
      });
      await newQuestion.save();
      //await questions.updateOne({user_id: req.body.user_id}, {$set : {question_answers: []}})
      res.json(newQuestion);
    } else {
      const newQuestion = new questions({
        user_id: req.body.user_id,
        question: req.body.question,
        question_type: req.body.question_type,
        question_order: req.body.question_order,
      });
      await newQuestion.save();
      //await questions.updateOne({user_id: req.body.user_id}, {$set : {question_selection: []}})
      res.json(newQuestion);
    }
  } catch (error) {
    console.log("Error on Post: " + error.message);
    res.status(400);
    res.send(error.message);
  }
});

router.get("/questions/all", async function (req, res) {
  console.log("Request: ");
  // console.log(req.session.cookie);
  // const Store = req.session.cookie.value.MemoryStore;
  // const store = new Store();
  // console.dir(store);

  // console.log(req.sessionStore);
  // console.log(req.body);
  //console.log("cookie: ", req.cookies.cookieName);

  // req.session.userId2 = "questionsAll";

  console.log("sessionID2", req.session.userId);

  try {
    const question = await questions.find({ user_id: req.session.userId });
    console.log("qestion questions all", question);
    if (question) {
      res.json(question);
    } else {
      res.send("No questions with id: " + id);
    }
  } catch (err) {
    console.error("Error on getting questions : ", err);
    res.status(500).send("Internal Server Error");
  }
});

//get questions by user_id
router.get("/questions/:user_id", async function (req, res) {
  let idInstance = req.params.user_id;
  console.log("idInstance type", idInstance);
  //const question = await questions.find({ user_id: idInstance });
  try {
    const question = await questions.find({ user_id: idInstance });
    if (question) {
      res.json(question);
    } else {
      res.send("No questions with id: " + id);
    }
  } catch (err) {
    console.error("Error on getting questions : ", err);
    res.status(500).send("Internal Server Error");
  }
});

//delete
router.delete(
  "/questions/:user_id&:question_order",
  isAgent,
  async function (req, res) {
    try {
      let idInstance = req.params.user_id;
      let questionOrder = req.params.question_order;

      await questions.deleteOne({
        user_id: idInstance,
        question_order: questionOrder,
      });
      console.log("Delete completed!");
      res.send("Delete questions with id: " + questionOrder);
    } catch (error) {
      console.log("Error on Delete: " + error.message);
      res.status(400);
      res.send(error.message);
    }
  }
);

router.put("/questions", isAgent, async function (req, res) {
  console.log("Put with body: " + JSON.stringify(req.body));

  try {
    const userId = req.body.user_id;
    const userQuestion = req.body.question;
    const newQuestion = {
      user_id: req.body.user_id,
      question: req.body.question,
      question_selection: req.body.question_selection,
      question_type: req.body.question_type,
      question_answers: req.body.question_answers,
    };
    await questions.updateOne(
      { user_id: userId, question: userQuestion },
      newQuestion
    );
    res.json(newQuestion);
  } catch (error) {
    console.log("Error on Post: " + error.message);
    res.status(400);
    res.send(error.message);
  }
});

module.exports = router;
