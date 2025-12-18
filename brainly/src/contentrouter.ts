import Router from "express";
export const contentrouter = Router();
import { middleware } from "./middleware";
import { Contentmodel } from "./db";
import { addingsummary, getGroqChatCompletion } from "./randomfunc";
import { Datainterface } from "./types";
contentrouter.post("/", middleware, async (req, res) => {
  let { title, link, contenttype, tags, note } = req.body;
  let processedLink;
  if (contenttype === "youtube") {
    console.log(link);
    if (link.length < 43) {
      processedLink = link.split("be/").slice(-1);
    } else {
      processedLink = link.split("v=").slice(-1);
    }
    processedLink = processedLink[0].slice(0, 11);
    console.log(processedLink);
  }
  if (contenttype === "twitter") {
    processedLink = link.split("/").slice(-1);
    processedLink = processedLink[0];
    if (processedLink.length != 19) {
      processedLink = processedLink.slice(0, 19);
    }
  }
  if (contenttype === "note") {
    processedLink = link;
  }
  const authorid = req.userid;
  let data: Datainterface = {
    title,
    link: processedLink,
    contenttype,
    tags: tags.tagarr,
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
contentrouter.get("/", middleware, async (req, res) => {
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
contentrouter.delete("/", middleware, async (req, res) => {
  const userid = req.userid;
  const contentid = req.body.contentid;
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
contentrouter.put("/updatesummary", middleware, async (req, res) => {
  const authorid = req.userid;
  const { id, summary } = req.body;
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
});

contentrouter.post("/query", middleware, async (req, res) => {
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
  console.log(finals);
  if (finals.documents.length == 0) {
    res
      .status(200)
      .json({ reply: "no content found around this question", filtered: [] });
    return;
  }
  const completion = await getGroqChatCompletion(question, finals.documents);
  console.log(completion.choices[0]?.message.content);
  console.log(finals.ids);
  res.status(200).json({
    reply: completion.choices[0]?.message.content,
    filtered: finals.ids,
  });
});

contentrouter.get("/post/:id", middleware, async function (req, res) {
  const contentid = req.params.id;
  const authorid = req.userid;
  const result = await Contentmodel.find({
    _id: contentid,
    authorid: authorid,
  });
  console.log(result);
  res.status(200).json(result);
});
