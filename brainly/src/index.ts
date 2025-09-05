import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { Usermodel, Contentmodel, Linkmodel, tagModel } from "./db";
import { middleware } from "./middleware";
import { randomhashgen, getGroqChatCompletion } from "./randomfunc";
import cors from "cors";

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
app.post("/api/v1/signup", async (req, res) => {
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

app.post("/api/v1/signin", async (req, res) => {
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
app.post("/api/v1/content", middleware, async (req, res) => {
  let { title, link, contenttype, tags } = req.body;
  if (contenttype === "youtube") {
    link = link.split("v=").slice(-1);
    if (link[0].length == 11) {
      link = link[0];
    } else {
      let finallink = "";
      for (let i = 0; i < 11; i++) {
        finallink = finallink + link[0][i];
      }
      link = finallink;
    }
  }
  if (contenttype === "twitter") {
    link = link.split("/").slice(-1);
    link = link[0];
  }
  const authorid = req.userid;
  let doccreated;
  try {
    doccreated = await Contentmodel.create({
      title,
      link,
      contenttype,
      tags: tags.tagarr,
      authorid,
      summary: "",
    });
    res.status(200).json({ message: "content added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
  try {
    const sumz = await fetch("http://127.0.0.1:8000/getsummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link }),
    });
    if (!sumz.ok) {
      const text = await sumz.text();
      console.error("getsummaryerror:", text);
      return;
    }
    let respsum;
    try {
      respsum = await sumz.json();
    } catch (e) {
      console.error("failedtorespsum:", e);
      return;
    }
    try {
      const updateddoc = await Contentmodel.findByIdAndUpdate(doccreated?._id, {
        summary: respsum.transcript[0].summary_text,
      });
      try {
        const sendsum = await fetch("http://127.0.0.1:8000/insertdoc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid: updateddoc?.authorid,
            contentid: updateddoc?._id,
            sum: respsum.transcript[0].summary_text,
          }),
        });
        const finaldat = await sendsum.json();
        console.log(finaldat);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/v1/content", middleware, async (req, res) => {
  const authorid = req.userid;
  try {
    const result = await Contentmodel.find({ authorid: authorid }).populate(
      "authorid",
      "username"
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});
app.delete("/api/v1/content", middleware, async (req, res) => {
  const userid = req.userid;
  try {
    await Contentmodel.deleteOne({ authorid: userid });
    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});
app.post("/api/v1/brain/share", middleware, async (req, res) => {
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
app.get("/api/v1/brain/share/:shareablelink", async (req, res) => {
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
app.post("/api/v1/tagname", middleware, async (req, res) => {
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
app.get("/api/v1/tagname", middleware, async (req, res) => {
  const authorid = req.userid;
  const resp = await tagModel.find({ authorid: authorid });
  res.status(200).json(resp);
});
app.put("/updatesummary", middleware, async (req, res) => {
  const authorid = req.userid;
  const { id, summary } = req.body;
  try {
    const updateddoc = await Contentmodel.findByIdAndUpdate(id, {
      summary: summary,
    });
    res.status(200).json({ message: "updated successfully" });
  } catch (e) {
    console.log(e);
  }
});
app.post("/query", middleware, async (req, res) => {
  const question = req.body.queryquestion;
  const userid = req.userid;
  const fetchedsummaries = await fetch("http://127.0.0.1:8000/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: question,
      userid: userid,
    }),
  });
  const finals = await fetchedsummaries.json();
  if (finals.documents.length == 0) {
    res.status(200).json({ reply: "no notes found around this question" });
    return;
  }
  const completion = await getGroqChatCompletion(question, finals.documents);
  console.log(completion.choices[0]?.message.content);
  res.status(200).json({
    reply: completion.choices[0]?.message.content,
    filtered: finals.ids,
  });
});
app.listen(3000);
