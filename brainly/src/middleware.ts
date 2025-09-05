import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_password = process.env.JWT_PASSWORD;
export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "please signin first" });
    return;
  }
  const verified = jwt.verify(token, JWT_password as string);
  if (verified) {
    if (typeof verified === "string") {
      return;
    }
    req.userid = verified.userid;
    next();
  } else {
    res.json({ message: "invalid login" });
  }
};
