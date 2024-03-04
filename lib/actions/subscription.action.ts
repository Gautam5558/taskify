"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Subscription from "../models/subscription.model";
import { stripe } from "../stripe";
import { absoluteUrl } from "../utils";
import { auth, currentUser } from "@clerk/nextjs";

export const redirectStripe = async () => {
  try {
    connectDb();
    const { userId, orgId } = auth();
    const user = await currentUser();
    if (!userId || !orgId || !user) {
      return new Error();
    }

    const settingsUrl = absoluteUrl("/organization/" + orgId);
    let url = "";

    const orgSubscription = await Subscription.findOne({ orgId });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
      console.log(url);
    } else {
      const stripesession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "required",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Taskify Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 500,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripesession.url || "";
    }
    revalidatePath("organization/" + orgId);
    return { data: url };
  } catch (err) {
    console.log(err);
  }
};

export const createSubscription = async (params: any) => {
  try {
    connectDb();
    const newSubscription = new Subscription({
      ...params,
    });
    await newSubscription.save();
  } catch (err) {
    console.log(err);
  }
};

export const updateSubscription = async (params: any) => {
  try {
    connectDb();
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: params.stripeSubscriptionId },
      {
        $set: {
          stripePriceId: params.stripePriceId,
          stripeCurrentPeriodEnd: params.stripeCurrentPeriodEnd,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const DAY_IN_MS = 86_400_000;
// Below function will check if subscription exists or not
export const checkSubscription = async () => {
  connectDb();
  const { orgId } = auth();

  // It means current user doesnt belong to any organization , hence he/she doesnt have any subscription also
  if (!orgId) {
    return false;
  }

  const orgSubscription = await Subscription.findOne(
    { orgId },
    {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    }
  );

  if (!orgSubscription) {
    return false;
  }

  // Now we know subscription exists, we have to check if it is expired or not

  const isValid =
    orgSubscription.stripePriceId &&
    new Date(orgSubscription.stripeCurrentPeriodEnd).getTime()! + DAY_IN_MS >
      Date.now();
  return !!isValid;
};
