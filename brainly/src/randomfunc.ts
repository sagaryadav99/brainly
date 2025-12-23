import Groq from "groq-sdk";
import { Contentmodel } from "./db";
import { ObjectId, Types } from "mongoose";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export function randomhashgen(len: number) {
  const rant = process.env.RANDOM_STRING!;
  const rantlen = rant.length;
  let hashed = "";
  for (var i = 0; i < len; i++) {
    hashed = hashed + rant[Math.floor(Math.random() * rantlen)];
  }
  return hashed;
}

export async function getGroqChatCompletion(question: string, documents: []) {
  let sumcontext = "";
  for (let sum in documents) {
    if (sumcontext === "") {
      sumcontext = "-" + documents[sum] + " \n";
    } else {
      sumcontext = sumcontext + "-" + documents[sum] + "\n";
    }
  }

  const prompt = `Context:
  ${sumcontext}
  Question:${question}
  use the above context to answer the question`;
  return groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: `You are an assistant that answers questions using only the summaries of YouTube videos, tweets and self-written notes provided to you.  
The input will contain:  
1. context with content summaries
2. A question from the user.  

Your task:  
- Answer the question using only the provided summaries as context.  
- Clearly indicate in your answer which part came from which video summary, tweet or slef-written note by adding references like [Content 1], [Content 2], etc., after each relevant part of your answer. (This is important) 
- Order should remain the same in which context is given.
- If the summaries don’t have enough information, say “The provided summaries do not contain enough information to answer this question.”  

Format your output like chatgpt with proper structure, spaces, bulltet points and use **bold** for headings if any.  
`,
      },
      // Set a user message for the assistant to respond to.
      {
        role: "user",
        content: `${prompt}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

export async function addingsummary(
  contenttype: string,
  link: string,
  id: Types.ObjectId,
  note: string
) {
  if (contenttype == "youtube") {
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
      updatingandinserting(id, respsum);
    } catch (e) {
      console.log(e);
    }
  } else if (contenttype == "twitter") {
    const url = "https://api.twitterapi.io/twitter/tweets?tweet_ids=" + link;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "X-API-Key": process.env.X_API_KEY as string },
        body: undefined,
      });
      const data = await response.json();
      const respsum = await gensum(data.tweets[0].text);
      const finalresp = await respsum?.json();
      await updatingandinserting(id, finalresp);
    } catch (error) {
      console.error(error);
    }
  } else if (contenttype == "note") {
    try {
      const respsum = await gensum(note);
      const finalresp = await respsum?.json();
      await updatingandinserting(id, finalresp);
    } catch (error) {
      console.log(error);
    }
  }
}
async function updatingandinserting(
  id: Types.ObjectId,
  respsum: { transcript: { summary_text: string }[] }
) {
  try {
    const updateddoc = await Contentmodel.findByIdAndUpdate(id, {
      summary: respsum.transcript[0].summary_text,
      summaryStatus: "ready",
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
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
async function gensum(summary: string) {
  try {
    const sum = await fetch("http://127.0.0.1:8000/gensum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: summary }),
    });
    return sum;
  } catch (error) {
    console.log(error);
  }
}
