import express from "express";
import { config } from "dotenv";
import "./bot";

config();

const app = express();
const port = process.env.PORT || "8080";
const baseurl = process.env.BASE_URL;

app.get("/", (req, res) => {
  res.send("Let the game begins!");
});

app.listen(port, () => {
  console.log(`App listening at ${baseurl}:${port}`);
});
