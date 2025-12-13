import { model, Schema, Types } from "mongoose";
const Userschema = new Schema({
  fname: { type: String, required: true },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});
export const Usermodel = model("Users", Userschema);
const Contentschema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  contenttype: { type: String, required: true },
  tags: { type: [String] },
  authorid: { type: Types.ObjectId, ref: "Users" },
  note: { type: String },
  summary: { type: String },
  summaryStatus: {
    type: String,
    enum: ["pending", "ready", "manual", "skipped"],
    default: "pending",
  },
});
export const Contentmodel = model("Contents", Contentschema);
const Linkschema = new Schema({
  hash: { type: String, required: true },
  authorid: { type: Types.ObjectId, ref: "Users" },
});

export const Linkmodel = model("Links", Linkschema);
const tagSchema = new Schema({
  tagname: { type: String },
  authorid: { type: Types.ObjectId, ref: "Users" },
});
export const tagModel = model("Tags", tagSchema);
