import Router from "express";
import { Usermodel } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const userrouter = Router();
const JWT_password = process.env.JWT_PASSWORD!;
userrouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    await Usermodel.create({
      username: username,
      password: await bcrypt.hash(password, 10),
    });
    res.status(200).json({ message: "user created successfully" });
  } catch (error: any) {
    if (error.errorResponse.code === 11000) {
      res.status(409).json({ response: "user already exists" });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
});

userrouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await Usermodel.findOne({ username: username });
    if (!result) {
      res.status(404).json({ message: "no user found, please signup" });
      return;
    }
    const matched = await bcrypt.compare(password, result.password);
    if (matched) {
      const token = jwt.sign({ userid: result._id }, JWT_password);
      res
        .status(200)
        .json({ message: "user signed in successfully", token: token });
    } else {
      res.status(401).json({ message: "wrong password entered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});
