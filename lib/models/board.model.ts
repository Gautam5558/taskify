import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    imageThumbUrl: {
      type: String,
      required: true,
    },
    imageFullUrl: {
      type: String,
      required: true,
    },
    imageUsername: {
      type: String,
      required: true,
    },
    imageLinkHtml: {
      type: String,
      required: true,
    },
    lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  },
  { timestamps: true }
);

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);
export default Board;
