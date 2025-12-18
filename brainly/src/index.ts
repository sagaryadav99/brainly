import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import { userrouter } from "./userrouter";
import cors from "cors";
import { contentrouter } from "./contentrouter";
import { brainrouter } from "./brainrouter";
import { tagrouter } from "./tagrouter";

const app = express();
app.use(express.json());
app.use(cors());
const JWT_password = process.env.JWT_PASSWORD!;

async function dbconnection() {
  try {
    await mongoose.connect("mongodb://localhost:27017/brainly");
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}
dbconnection();
app.use("/api/v1", userrouter);
app.use("/api/v1/content", contentrouter);
app.use("/api/v1/brain", brainrouter);
app.use("/api/v1/tagname", tagrouter);
app.listen(3000, "0.0.0.0");
