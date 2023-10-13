const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cellphone:{
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["MANAGER", "OPERADOR", "CLIENTE", "MECANICO"],
    default: "CLIENTE"
  },
  active: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    default: "12345Az"   
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
