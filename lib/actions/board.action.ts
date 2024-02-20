"use server";

import { connectDb } from "../connect";
import Board from "../models/board.model";

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
    const { organizationId } = params;
    const boards = await Board.find({ organizationId });
    return { boards };
  } catch (err) {
    console.log(err);
  }
};
