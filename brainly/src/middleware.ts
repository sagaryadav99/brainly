import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_password = process.env.JWT_PASSWORD;
export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "please signin first" });
    return;
  }
  try {
    const verified = jwt.verify(token, JWT_password as string);

    if (typeof verified === "string") {
      return;
    }
    req.userid = verified.userid;
    next();
  } catch (err) {
    res.status(401).json({ message: "session expired, please login again" });
  }
};
