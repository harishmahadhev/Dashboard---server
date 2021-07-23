import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: { type: String, required: true },
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  address: { type: String, required: true },
  job: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
  createAt: Date,
});

const loginSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const userData = mongoose.model("User", userSchema);
export const loginData = mongoose.model("LoginData", loginSchema);
