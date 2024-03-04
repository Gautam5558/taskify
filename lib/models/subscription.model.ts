import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
  stripeCurrentPeriodEnd: {
    type: String,
    required: true,
  },
});

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
