import Router from "express";
import { Contentmodel, Linkmodel } from "./db";
import { randomhashgen } from "./randomfunc";
import { middleware } from "./middleware";
import { brainSchema } from "./schemas/brain.schem";
import { shareLimiter } from "./limiters";
export const brainrouter = Router();
brainrouter.post("/share", middleware, shareLimiter, async (req, res) => {
  const parsed = brainSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid option",
      error: parsed.error,
    });
    return;
  }
  const { share } = parsed.data;
  const randomhash = randomhashgen(10);
  const existing = await Linkmodel.findOne({ authorid: req.userid });
  if (existing) {
    if (share) {
      res.json({
        message: "you already have a shareable link",
        Link: existing.hash,
      });
    } else {
      await Linkmodel.deleteOne({ authorid: req.userid });
      res.json({ message: "deleted successfully" });
    }
  } else {
    if (share) {
      await Linkmodel.create({ hash: randomhash, authorid: req.userid });
      res.json({ message: "link created successfully", Link: randomhash });
    } else {
      res.json({ message: "you don't have a link to delete" });
    }
  }
});
brainrouter.get("/:shareablelink", async (req, res) => {
  const hash = req.params.shareablelink;
  const linkdocument = await Linkmodel.findOne({ hash: hash });
  if (!linkdocument) {
    res.status(400).json({ message: "this link is not valid/expired" });
    return;
  }
  const data = await Contentmodel.find({
    authorid: linkdocument.authorid,
  }).populate("authorid", "username");
  res.json(data);
});
