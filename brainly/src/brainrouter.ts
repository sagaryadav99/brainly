import Router from "express";
import { Contentmodel, Linkmodel } from "./db";
import { randomhashgen } from "./randomfunc";
import { middleware } from "./middleware";
export const brainrouter = Router();
brainrouter.get("/share", middleware, async (req, res) => {
  const { share } = req.body;
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
    res.json({ message: "this link is not valid" });
    return;
  }
  const data = await Contentmodel.find({
    authorid: linkdocument.authorid,
  }).populate("authorid", "username");
  res.json({ data: data });
});
