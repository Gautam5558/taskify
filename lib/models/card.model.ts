import mongoose, { Schema } from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);
export default Card;
