const Users = require("../models/users");

class UsersService {
  async getUserById(id) {
    try {
      const user = await Users.find({ user_id: id });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await Users.find({});
      return users;
    } catch (error) {
      throw error;
    }
  }

  async addUser(user) {
    try {
      const newUser = new Users(user);
      const savedUser = await newUser.save();
      //return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const updatedUser = await Users.findByIdAndUpdate(id, userData, {
        new: true,
      });
      //return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const deletedUser = await Users.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsersService;
