import express from "express";
import { userData } from "../models/user_model.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const user = await userData.find({});
    res.send(user);
  })
  .post(async (req, res) => {
    const addUser = req.body;
    const user = new userData(addUser);
    console.log(user);
    try {
      const newUser = await user.save();
      res.send(newUser);
    } catch (err) {
      response.status(500);
      response.send(err);
    }
  });
router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const user = await userData.findById(id);
    res.send(user);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userData.findByIdAndRemove(id);
      res.send({ ...user._doc, message: "Deleted successfully" });
    } catch (err) {
      res.status(500);
      res.send("User is missing");
    }
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userData.findByIdAndUpdate(id, req.body);
      res.send(user);
    } catch (err) {
      res.status(500);
      res.send(err);
    }
  });

export const userRouter = router;
