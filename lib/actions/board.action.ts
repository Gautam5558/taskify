"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Board from "../models/board.model";
import { redirect } from "next/navigation";

export const createBoard = async (params: any) => {
  try {
    connectDb();
    const { title, organizationId, imgData } = params;
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
}) => {
  try {
    connectDb();
    const { boardId, title } = params;
    await Board.findByIdAndUpdate(boardId, { $set: { title } });
  } catch (err) {
    console.log(err);
  }
};

export const deleteBoard = async (params: {
  boardId: string;
  orgId: string;
}) => {
  try {
    connectDb();
    const { boardId, orgId } = params;
    await Board.findByIdAndDelete(boardId);
    revalidatePath("/organization/" + orgId);
  } catch (err) {
    console.log(err);
  }
};
