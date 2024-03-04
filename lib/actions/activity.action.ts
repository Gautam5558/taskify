"use server";

import { connectDb } from "../connect";
import Activity from "../models/activity.model";

export const getActivitiesByCardId = async (params: { cardId: string }) => {
  try {
    connectDb();
    const { cardId } = params;
    const data = await Activity.find({ itemId: cardId }).sort({
      createdAt: -1,
    });
    return { data };
  } catch (err) {
    console.log(err);
  }
};

export const getActivitiesByOrgId = async (params: { orgId: string }) => {
  try {
    connectDb();
    const { orgId } = params;
    const data = await Activity.find({ orgId }).sort({ createdAt: -1 });
    return { data };
  } catch (err) {
    console.log(err);
  }
};
