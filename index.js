import express, { json } from "express";
import "./db_connection.js";
import { userRouter } from "./routes/user_route.js";
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/users", userRouter);

// Server Connection
app.listen(PORT, () => console.log(`Server Started Running at ${PORT}`));
