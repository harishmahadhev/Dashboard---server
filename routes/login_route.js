import express from "express";
import { loginData } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import bcyrpt from "bcryptjs";
import { signinValidation, signupValidation } from "./../shared/validation.js";
import crypto from "crypto";
import { senderMail } from "./app.js";
const router = express.Router();

router.route("/signin").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = signinValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const userExists = await loginData.findOne({ email });
    if (!userExists)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcyrpt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: userExists.email, id: userExists._id },
      "dashboard",
      { expiresIn: "8h" }
    );
    res.status(200).json({ message: userExists, token: token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router
  .route("/signup")
  .post(async (req, res) => {
    let { email, password, fullname } = req.body;
    try {
      const { error } = signupValidation(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const userExists = await loginData.findOne({ email });
      if (userExists)
        return res.status(404).json({ message: "User already exist" });
      const salt = await bcyrpt.genSalt(12);
      password = await bcyrpt.hash(req.body.password, salt);
      const result = await loginData.create({ email, password, fullname });
      const token = jwt.sign(
        { email: result.email, id: result._id },
        "dashboard",
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: result, token });
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
      console.log(error);
    }
  })
  .get(async (req, res) => {
    try {
      const user = await loginData.find({});
      res.send(user);
    } catch (error) {
      console.log(error);
    }
  });
router
  .route("/signup/:id")
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      const user = await loginData.findByIdAndRemove(id);
      res.send(user);
    } catch (error) {}
  })
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const user = await loginData.findById(id);
      res.send(user);
    } catch (error) {
      console.log(error);
    }
  });

router.route("/forgotpassword").post((req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    loginData.findOne({ email: req.body.email }).then((user) => {
      user.resettoken = token;
      user.expiretoken = Date.now() + 1800000;
      user.save();
      senderMail(user.email, token)
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      res.send({ data: "check your mail" });
    });
  });
});

router.route("/reset").post(async (req, res) => {
  const { token, password } = req.body;
  const user = await loginData.findOne({
    resettoken: token,
    expiretoken: { $gt: Date.now() },
  });
  if (!user) res.status(422).json({ message: "token expired" });
  const salt = await bcyrpt.genSalt(12);
  const hashedpassword = await bcyrpt.hash(password, salt);
  user.password = hashedpassword;
  user.resettoken = undefined;
  user.expiretoken = undefined;
  loginData.findByIdAndUpdate(user._id, {
    resettoken: user.resettoken,
    expiretoken: user.expiretoken,
    password: user.password,
  });
  res.json({ message: "Password updated" });
});

export const loginRouter = router;
