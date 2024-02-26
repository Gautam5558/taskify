"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Card from "../models/card.model";
import List from "../models/list.model";
import Activity from "../models/activity.model";
import { auth } from "@clerk/nextjs";

const { orgId } = auth();

export const createCard = async (params: {
  listId: string;
  pathname: string;
  title: string;
  userId: string | undefined;
  userImage: string | undefined;
  username: string | undefined | null;
}) => {
  try {
    connectDb();
    const { listId, pathname, title, userId, userImage, username } = params;

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

    const newActivity = new Activity({
      typeOfActivity: "created",
      orgId: orgId,
      itemId: newCard._id,
      itemType: "card",
      itemTitle: newCard.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const updateCardsOrder = async (params: {
  updatedCardsOrderArray: any;
  pathname: string;
  listId?: string;
  type?: string;
  movedCardId?: string;
}) => {
  try {
    connectDb();
    const { updatedCardsOrderArray, pathname, listId, type, movedCardId } =
      params;
    for (let i = 0; i < updatedCardsOrderArray.length; i++) {
      await Card.findByIdAndUpdate(updatedCardsOrderArray[i]._id, {
        $set: {
          order: updatedCardsOrderArray[i].order,
          listId: updatedCardsOrderArray[i].listId,
        },
      });
    }

    if (type) {
      if (type === "source") {
        await List.findByIdAndUpdate(listId, { $pull: { cards: movedCardId } });
      }
      if (type === "destination") {
        await List.findByIdAndUpdate(listId, { $push: { cards: movedCardId } });
      }
    }

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const updateCardtitle = async (params: {
  cardId: string;
  title: string;
  pathname: string;
  userId: string | undefined;
  userImage: string | undefined;
  username: string | undefined | null;
}) => {
  try {
    connectDb();
    const { cardId, title, pathname, userId, userImage, username } = params;
    await Card.findByIdAndUpdate(cardId, { $set: { title } });
    const newActivity = new Activity({
      typeOfActivity: "updated",
      orgId: orgId,
      itemId: cardId,
      itemType: "card",
      itemTitle: title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const updateCardDesciption = async (params: {
  cardId: string;
  description: string;
  pathname: string;
  userId: string | undefined;
  userImage: string | undefined;
  username: string | undefined | null;
}) => {
  try {
    connectDb();
    const { cardId, description, pathname, userId, userImage, username } =
      params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $set: { description } },
      { new: true }
    );
    const newActivity = new Activity({
      typeOfActivity: "updated",
      orgId: orgId,
      itemId: cardId,
      itemType: "card",
      itemTitle: card.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();
    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const deleteCard = async (params: {
  cardId: string;
  listId: string;
  pathname: string;
  userId: string | undefined;
  userImage: string | undefined;
  username: string | undefined | null;
}) => {
  try {
    connectDb();
    const { cardId, listId, pathname, userId, userImage, username } = params;
    await List.findByIdAndUpdate(listId, { $pull: { cards: cardId } });
    const card = await Card.findByIdAndDelete(cardId);

    const newActivity = new Activity({
      typeOfActivity: "deleted",
      orgId: orgId,
      itemId: cardId,
      itemType: "card",
      itemTitle: card.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const copyCard = async (params: {
  cardId: string;
  listId: string;
  pathname: string;
  userId: string | undefined;
  userImage: string | undefined;
  username: string | undefined | null;
}) => {
  try {
    connectDb();
    const { cardId, listId, pathname, userId, userImage, username } = params;

    const list = await List.findById(listId);

    if (!list) {
      return console.log(
        "The list of which you want to copy a card doesn't exist"
      );
    }

    const cardToCopy = await Card.findById(cardId);

    const listCardsArray = await Card.aggregate([
      { $match: { listId: list._id } },
      { $sort: { order: -1 } },
      { $limit: 1 },
    ]);

    const lastCard = listCardsArray[0];

    let order = 1;
    if (!lastCard) {
      return console.log(
        "It means there is an error as no card exists in the list but i am trying to copy a card existing in the list"
      );
    } else {
      order = lastCard.order + 1;
    }

    const newCard = new Card({
      title: cardToCopy.title + " - copy",
      description: cardToCopy.description,
      order,
      listId: list._id,
    });

    await newCard.save();

    await List.findByIdAndUpdate(list._id, { $push: { cards: newCard._id } });

    const newActivity = new Activity({
      typeOfActivity: "created",
      orgId: orgId,
      itemId: newCard._id,
      itemType: "card",
      itemTitle: newCard.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};
