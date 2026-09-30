const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: [true, 'Username already exists']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: [true, 'account  already exists with this email']
  },
  password: {
    type: String,
    required: true
  }
});


const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;