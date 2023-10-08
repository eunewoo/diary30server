const questions = require("../models/questions");

class QuestionsService {
  async addQuestion(data) {
    const newQuestion = new questions(data);
    return await newQuestion.save();
  }

  async getQuestionsByUserId(userId) {
    return await questions.find({ user_id: userId });
  }

  async deleteQuestionByUserIdAndOrder(userId, order) {
    return await questions.deleteOne({
      user_id: userId,
      question_order: order,
    });
  }

  async updateQuestion(data) {
    const { user_id, question } = data;
    return await questions.updateOne({ user_id, question }, data);
  }
}

module.exports = QuestionsService;
