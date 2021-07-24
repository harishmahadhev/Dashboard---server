import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGOURL || process.env.URL;

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log("Error : ", JSON.stringify(err, undefined, 2));
  }
);
const connect = mongoose.connection;
connect.on("open", () => console.log("Mongodb is connected"));
