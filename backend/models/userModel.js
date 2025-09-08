const {
  Schema,
  model
} = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
     maxlength: 50
  },
  email:{
    type: String,
    required: true,
    maxlength: 50
  },
  password:{
       type: String,
    required: true,
    minlength :6
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model("User", UserSchema)

module.exports = UserModel