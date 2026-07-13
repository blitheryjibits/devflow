import { Schema, model, models, Types } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  views: number;
  upVotes: number;
  downVotes: number;
  answers: number;
  tags: Types.ObjectId[];
  author: Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, default: 0 },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const question = models?.question || model<IQuestion>("Question", QuestionSchema);

export default question;
