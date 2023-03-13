const users = require("../models/users");
const { wrapAsync } = require("../utils/helper");

// Check whether user is logged in or not
// But not being used because session is not adapted yet
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    throw new Error("Need to login first");
  }
  next();
};

// If the author has an agent, the logged in user must be that agent to access
// But not being used because session is not adapted yet
module.exports.isAgent = wrapAsync(async (req, res, next) => {
  const id = req.params.user_id;
  const user = await users.getUserById(id);
  if (user._id && !user._id.equals(req.session.userId)) {
    throw new ExpressError("Not an authorized agent for this user", 401);
  }
  next();
});
