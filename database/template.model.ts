import { Schema, model, models, Types } from "mongoose";

export interface IModel {
  title: string;
}

const ModelSchema = new Schema<IModel>({}, { timestamps: true });

const Model = models?.question || model<IModel>("Model", ModelSchema);

export default Model;
