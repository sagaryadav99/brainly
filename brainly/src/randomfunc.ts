import Groq from "groq-sdk";

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
  console.log(documents);
  for (let sum in documents) {
    if (sumcontext === "") {
      sumcontext = "-" + documents[sum] + " \n";
    } else {
      sumcontext = sumcontext + "-" + documents[sum] + "\n";
    }
  }
  console.log(sumcontext);
  const prompt = `Context:
  ${sumcontext}
  Question:${question}
  use the above context to answer the question`;
  console.log(prompt);
  return groq.chat.completions.create({
    messages: [
      // Set an optional system message. This sets the behavior of the
      // assistant and can be used to provide specific instructions for
      // how it should behave throughout the conversation.
      {
        role: "system",
        content: `You are an assistant that answers questions using only the summaries of YouTube videos provided to you.  
The input will contain:  
1. context with video summaries
2. A question from the user.  

Your task:  
- Answer the question using only the provided summaries as context.  
- Clearly indicate in your answer which part came from which video summary by adding references like [Video 1], [Video 2], etc., after each relevant part of your answer.  
- If the summaries don’t have enough information, say “The provided summaries do not contain enough information to answer this question.”  

Format your output like chatgpt with proper structure, spaces and bullet points  
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
