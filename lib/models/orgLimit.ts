import mongoose from "mongoose";

const orgLimitSchema = new mongoose.Schema(
  {
    orgId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const OrgLimit =
  mongoose.models.OrgLimit || mongoose.model("OrgLimit", orgLimitSchema);
export default OrgLimit;
