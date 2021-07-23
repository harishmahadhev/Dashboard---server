import express, { json } from "express";
import "./db_connection.js";
import { loginRouter } from "./routes/login_route.js";
import { userRouter } from "./routes/user_route.js";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/users", userRouter);
app.use("/login", loginRouter);

// Server Connection
app.listen(PORT, () => console.log(`Server Started Running at ${PORT}`));
