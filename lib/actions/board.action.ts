"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "../connect";
import Board from "../models/board.model";
import { redirect } from "next/navigation";
import Activity from "../models/activity.model";
import OrgLimit from "../models/orgLimit";
import { MAX_FREE_BOARDS_ALLOWED } from "@/constants";
import { checkSubscription } from "./subscription.action";

export const createBoard = async (params: {
  title: string;
  organizationId: string | undefined;
  imgData: string;
  userId: string | undefined;
  username: string | undefined | null;
  userImage: string | undefined;
  orgId: string | undefined | null;
  pathname: string;
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
      pathname,
    } = params;

    const isPro = await checkSubscription();
    if (!isPro) {
      const orgLimitDocument = await OrgLimit.findOne({ orgId });

      if (!orgLimitDocument) {
        // It means we are creating 1st board of organization which is allowed for free
        const newOrgLimitDocument = new OrgLimit({
          orgId,
          count: 1,
        });

        await newOrgLimitDocument.save();
      } else {
        // It means we have already created boards for this organization, now we have to check for counts of boards

        if (orgLimitDocument.count < MAX_FREE_BOARDS_ALLOWED) {
          // It means we can create more free boards
          await OrgLimit.findOneAndUpdate({ orgId }, { $inc: { count: 1 } });
        } else {
          // It means we are creating 6th board and it is only allowed after subscription and since we check for count after checking for subscription, hence it means subscription doesnt exist

          const error = new Error();
          error.message = "To create more boards upgrade to Pro Plan";
          return error;
        }
      }

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
      revalidatePath(pathname);
      return { newBoard };
    } else {
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
      revalidatePath(pathname);
      return { newBoard };
    }
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
    // On deleting a board , the orgLimit document corresponding to the the organization to which this board belongs to , this document's count will decrement by 1, but i do this only if i am on pro
    const isPro = await checkSubscription();
    if (!isPro) {
      await OrgLimit.findOneAndUpdate({ orgId }, { $inc: { count: -1 } });
    }
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
