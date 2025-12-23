import Router from "express";
import { tagModel } from "./db";
import { middleware } from "./middleware";
import { tagSchema } from "./schemas/tag.schema";
export const tagrouter = Router();
tagrouter.post("/", middleware, async (req, res) => {
  const parsed = tagSchema.safeParse(req.body.tagname);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid input",
      error: parsed.error,
    });
    return;
  }
  const userid = req.userid;
  const tagname = req.body.tagname;
  const tagfound = await tagModel.exists({
    tagname: tagname,
    authorid: userid,
  });
  if (!tagfound) {
    await tagModel.create({ tagname: tagname, authorid: userid });
  }
  res.status(200).json({ message: "created successfully" });
});
tagrouter.get("/", middleware, async (req, res) => {
  const authorid = req.userid;
  const resp = await tagModel.find({ authorid: authorid });
  res.status(200).json(resp);
});
