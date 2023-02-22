const users = require("../models/users");

exports.getUserById = async function (idInstance) {
  return users.find({ user_id: idInstance });
};
