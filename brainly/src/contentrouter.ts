import Router from "express";
export const contentrouter = Router();
import { middleware } from "./middleware";
import { Contentmodel } from "./db";
import { addingsummary, getGroqChatCompletion } from "./randomfunc";
import { Datainterface } from "./types";
import { questionLimit, contentaddLimit, generalLimiter } from "./limiters";

import {
  contentSchema,
  idSchema,
  queryquestionSchema,
  updatesummarySchema,
} from "./schemas/content.schema";
contentrouter.post("/", middleware, contentaddLimit, async (req, res) => {
  const parsed = contentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: JSON.parse(parsed.error.message)[0].message,
      error: parsed.error,
    });
    return;
  }
  let { title, link, contenttype, tags, note } = parsed.data;
  let processedLink;
  if (contenttype === "youtube") {
    if (link.length < 43) {
      processedLink = link.split("be/").slice(-1);
    } else {
      processedLink = link.split("v=").slice(-1);
    }
    processedLink = processedLink[0].slice(0, 11);
  } else if (contenttype === "twitter") {
    processedLink = link.split("/").slice(-1);
    processedLink = processedLink[0];
    if (processedLink.length != 19) {
      processedLink = processedLink.slice(0, 19);
    }
  } else {
    processedLink = link;
  }
  if (!req.userid) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const authorid = req.userid;
  let data: Datainterface = {
    title,
    link: processedLink,
    contenttype,
    tags: tags.tagarr ?? [],
    authorid,
    summary: "",
    summaryStatus: "pending",
  };
  if (contenttype === "note") {
    data.note = note;
  }
  let doccreated;
  try {
    doccreated = await Contentmodel.create(data);
    addingsummary(
      doccreated.contenttype,
      doccreated.link,
      doccreated._id,
      doccreated.note ? doccreated.note : ""
    );
    res
      .status(200)
      .json({ message: "content added successfully", id: doccreated._id });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});
contentrouter.get("/", middleware, generalLimiter, async (req, res) => {
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
contentrouter.delete("/", middleware, generalLimiter, async (req, res) => {
  const userid = req.userid;
  const parsed = idSchema.safeParse(req.body.contentid);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid content id",
      error: parsed.error,
    });
    return;
  }
  const contentid = parsed.data;
  try {
    await Contentmodel.deleteOne({ authorid: userid, _id: contentid });
    const chromadelete = await fetch("http://localhost:8000/deletedoc", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: contentid,
      }),
    });
    const resp = await chromadelete.json();
    console.log(resp);
    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});
contentrouter.put(
  "/updatesummary",
  middleware,
  generalLimiter,
  async (req, res) => {
    const authorid = req.userid;
    const parsed = updatesummarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "invalid inputs for updateSummary",
        error: parsed.error,
      });
      return;
    }
    const { id, summary } = parsed.data;
    try {
      const updateddoc = await Contentmodel.findByIdAndUpdate(id, {
        summary: summary,
        summaryStaus: "manual",
      });
      if (!updateddoc) {
        return;
      }
      const chromaupdate = await fetch("http://localhost:8000/updatedoc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: updateddoc.authorid,
          contentid: updateddoc._id,
          sum: updateddoc.summary,
        }),
      });
      const resp = await chromaupdate.json();
      console.log(resp);
      res.status(200).json({ message: "updated successfully" });
    } catch (e) {
      console.log(e);
    }
  }
);

contentrouter.post("/query", middleware, questionLimit, async (req, res) => {
  const parsed = queryquestionSchema.safeParse(req.body.queryquestion);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid question",
      error: parsed.error,
    });
    return;
  }
  const question = parsed.data;
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
    res
      .status(200)
      .json({ reply: "no content found around this question", filtered: [] });
    return;
  }
  const completion = await getGroqChatCompletion(question, finals.documents);
  res.status(200).json({
    reply: completion.choices[0]?.message.content,
    filtered: finals.ids,
  });
});

contentrouter.get("/post/:id", middleware, async function (req, res) {
  const parsed = idSchema.safeParse(req.params.contentid);
  if (!parsed.success) {
    res.status(400).json({
      message: "invalid content id",
      error: parsed.error,
    });
    return;
  }
  const contentid = parsed.data;
  const authorid = req.userid;
  const result = await Contentmodel.find({
    _id: contentid,
    authorid: authorid,
  });
  res.status(200).json(result);
});
