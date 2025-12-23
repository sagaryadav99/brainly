import Router from "express";
import { Usermodel } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usersigninSchema, usersignupSchema } from "./schemas/user.schema";
import { authLimiter } from "./limiters";
export const userrouter = Router();
const JWT_password = process.env.JWT_PASSWORD!;
userrouter.post("/signup", authLimiter, async (req, res) => {
  const parsed = usersignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid input",
      errors: parsed.error,
    });
    return;
  }
  const { fname, username, password } = parsed.data;
  try {
    await Usermodel.create({
      fname: fname,
      username: username,
      password: await bcrypt.hash(password, 10),
    });
    res.status(200).json({ message: "user created successfully" });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ message: "user already exists" });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
});

userrouter.post("/signin", authLimiter, async (req, res) => {
  const parsed = usersigninSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid input",
      error: parsed.error,
    });
    return;
  }
  const { username, password } = parsed.data;
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
    res.status(500).json({ message: error });
  }
});
