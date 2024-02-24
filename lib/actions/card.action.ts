"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Card from "../models/card.model";
import List from "../models/list.model";

export const createCard = async (params: {
  listId: string;
  pathname: string;
  title: string;
}) => {
  try {
    connectDb();
    const { listId, pathname, title } = params;

    const list = await List.findById(listId);

    if (!list) {
      return console.log(
        "You are trying to create a card for a list that doesn't exist"
      );
    }

    const allCardsOfThisListArray = await Card.aggregate([
      { $match: { listId: list._id } },
      { $sort: { order: -1 } },
      { $limit: 1 },
    ]);

    // Here last card specifies that card which has the highest order from all cards of this list
    const lastCard = allCardsOfThisListArray[0];

    let order = 1;
    if (!lastCard) {
      // Here it mean there is no card in the list hence we are creating 1st card of this list
      order = 1;
    } else {
      order = lastCard.order + 1;
    }

    const newCard = new Card({
      title,
      listId,
      order,
    });

    await newCard.save();

    await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};
