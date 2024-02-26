import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    typeOfActivity: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;
