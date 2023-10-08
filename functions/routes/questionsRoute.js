const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/helper");
const QuestionsService = require("./services/QuestionsService");

const questionsService = new QuestionsService();

router.post(
  "/questions",
  wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));

    let data;
    if (req.body.question_type === "multiple choice") {
      data = {
        user_id: req.body.user_id,
        question: req.body.question,
        question_selection: req.body.question_selection,
        question_type: req.body.question_type,
        question_order: req.body.question_order,
      };
    } else {
      data = {
        user_id: req.body.user_id,
        question: req.body.question,
        question_type: req.body.question_type,
        question_order: req.body.question_order,
      };
    }
    const newQuestion = await questionsService.addQuestion(data);
    res.json(newQuestion);
  })
);

router.get(
  "/questions/:user_id",
  wrapAsync(async function (req, res) {
    const idInstance = req.params.user_id;
    const question = await questionsService.getQuestionsByUserId(idInstance);
    if (question) {
      res.json(question);
    } else {
      res.send("No questions with id: " + idInstance);
    }
  })
);

router.delete(
  "/questions/:user_id&:question_order",
  wrapAsync(async function (req, res) {
    let idInstance = req.params.user_id;
    let questionOrder = req.params.question_order;

    await questionsService.deleteQuestionByUserIdAndOrder(
      idInstance,
      questionOrder
    );
    console.log("Delete completed!");
    res.send("Delete questions with id: " + questionOrder);
  })
);

router.put(
  "/questions",
  wrapAsync(async function (req, res) {
    console.log("Put with body: " + JSON.stringify(req.body));

    const data = {
      user_id: req.body.user_id,
      question: req.body.question,
      question_selection: req.body.question_selection,
      question_type: req.body.question_type,
      question_answers: req.body.question_answers,
    };
    const updatedQuestion = await questionsService.updateQuestion(data);
    res.json(updatedQuestion);
  })
);

module.exports = router;
