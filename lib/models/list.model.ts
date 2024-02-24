import mongoose, { Schema } from "mongoose";

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requitred: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
    order: {
      type: Number,
      required: true,
    },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

const List = mongoose.models.List || mongoose.model("List", listSchema);
export default List;
