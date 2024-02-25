"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Board from "../models/board.model";
import List from "../models/list.model";

export const getListsFromBoardId = async (params: { boardId: string }) => {
  try {
    connectDb();
    const { boardId } = params;
    const lists = await List.find({ boardId })
      .populate({
        path: "cards",
        model: "Card",
        options: { sort: { order: 1 } },
      })
      .sort({ order: 1 });
    return { lists };
  } catch (err) {
    console.log(err);
  }
};

export const createList = async (params: {
  title: string;
  boardId: string;
  pathname: string;
}) => {
  try {
    connectDb();
    const { title, boardId, pathname } = params;

    const board = await Board.findById(boardId);

    if (!board) {
      return console.log("Board doesnt exist");
    }

    console.log(boardId);

    const existingLastListArray = await List.aggregate([
      { $match: { boardId: board._id } },
      { $sort: { order: -1 } },
      { $limit: 1 },
    ]);

    let order = 1;
    if (existingLastListArray.length !== 1) {
      // This means we are creating 1st list of the board
      order = 1;
    } else {
      // This means board already contains lists.So new oder is dependent on last list order
      const lastList = existingLastListArray[0];
      order = lastList.order + 1;
    }

    const newList = new List({
      title,
      boardId,
      order: order,
    });

    await newList.save();

    await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const listTitleUpdate = async (params: {
  listId: string;
  title: string;
  pathname: string;
}) => {
  try {
    connectDb();
    const { listId, title, pathname } = params;
    await List.findByIdAndUpdate(listId, { $set: { title } });
    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const deleteList = async (params: {
  listId: string;
  pathname: string;
}) => {
  try {
    connectDb();
    const { listId, pathname } = params;
    // When we create the cards of this list then we will come back here and when deleting a list, first we will delete its cards
    await List.findByIdAndDelete(listId);
    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const copyListByListId = async (params: {
  listId: string;
  pathname: string;
  boardId: string | string[];
}) => {
  try {
    connectDb();
    const { listId, boardId, pathname } = params;
    const existingList = await List.findById(listId);

    const board = await Board.findById(boardId);

    if (!existingList) {
      return console.log("List from which to copy new list doesn't exist");
    }

    const existingListsOfBoard = await List.aggregate([
      { $match: { boardId: board._id } },
      { $sort: { order: -1 } },
      { $limit: 1 },
    ]);
    // Here lastList refers to list with the highest order
    const lastList = existingListsOfBoard[0];

    if (!lastList) {
      return console.log(
        "There doesnt exist any list inside the board to be copied"
      );
    }

    const order = lastList.order + 1;

    //When we will create cards for this list , then we will even copy them (TODO)

    const newList = new List({
      title: existingList.title + " - copy",
      boardId: existingList.boardId,
      order: order,
    });

    await newList.save();

    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};

export const updateListorder = async (params: {
  updatedListsByOrder: any;
  boardId: string;
  pathname: string;
}) => {
  try {
    connectDb();
    const { updatedListsByOrder, boardId, pathname } = params;
    for (let i = 0; i < updatedListsByOrder.length; i++) {
      await List.findByIdAndUpdate(updatedListsByOrder[i]._id, {
        $set: { order: updatedListsByOrder[i].order },
      });
    }
    revalidatePath(pathname);
  } catch (err) {
    console.log(err);
  }
};
