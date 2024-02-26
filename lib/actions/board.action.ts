"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Board from "../models/board.model";
import { redirect } from "next/navigation";
import Activity from "../models/activity.model";

export const createBoard = async (params: {
  title: string;
  organizationId: string | undefined;
  imgData: string;
  userId: string | undefined;
  username: string | undefined | null;
  userImage: string | undefined;
  orgId: string | undefined | null;
}) => {
  try {
    connectDb();
    const {
      title,
      organizationId,
      imgData,
      userId,
      username,
      userImage,
      orgId,
    } = params;
    const dataArray = imgData.split("|");
    const newBoard = new Board({
      title: title,
      organizationId: organizationId,
      imageId: dataArray[0],
      imageThumbUrl: dataArray[1],
      imageFullUrl: dataArray[2],
      imageLinkHtml: dataArray[3],
      imageUsername: dataArray[4],
    });

    await newBoard.save();

    const newActivity = new Activity({
      typeOfActivity: "created",
      orgId: orgId,
      itemId: newBoard._id,
      itemType: "board",
      itemTitle: newBoard.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    return { newBoard };
  } catch (err) {
    console.log(err);
  }
};

export const getBoardsByOrganizationId = async (params: any) => {
  try {
    connectDb();
    const { organizationId } = params;
    const boards = await Board.find({ organizationId });
    return { boards };
  } catch (err) {
    console.log(err);
  }
};

export const getBoardData = async (params: { boardId: string }) => {
  try {
    connectDb();
    const { boardId } = params;
    const board = await Board.findById(boardId);
    return { board };
  } catch (err) {
    console.log(err);
  }
};

export const updateBoardTitle = async (params: {
  boardId: string;
  title: string;
  userId: string | undefined;
  username: string | undefined | null;
  userImage: string | undefined;
  orgId: string | undefined | null;
}) => {
  try {
    connectDb();
    const { boardId, title, userId, username, userImage, orgId } = params;
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $set: { title } },
      { new: true }
    );

    const newActivity = new Activity({
      typeOfActivity: "updated",
      orgId: orgId,
      itemId: board._id,
      itemType: "board",
      itemTitle: board.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();
  } catch (err) {
    console.log(err);
  }
};

export const deleteBoard = async (params: {
  boardId: string;
  orgId: string;
  userId: string | undefined;
  username: string | undefined | null;
  userImage: string | undefined;
}) => {
  try {
    connectDb();
    const { boardId, userId, username, userImage, orgId } = params;
    const board = await Board.findByIdAndDelete(boardId);

    const newActivity = new Activity({
      typeOfActivity: "deleted",
      orgId: orgId,
      itemId: board._id,
      itemType: "board",
      itemTitle: board.title,
      userId,
      userImage,
      username,
    });

    await newActivity.save();

    revalidatePath("/organization/" + orgId);
  } catch (err) {
    console.log(err);
  }
};
