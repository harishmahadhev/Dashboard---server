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

export const userData = mongoose.model("User", userSchema);
