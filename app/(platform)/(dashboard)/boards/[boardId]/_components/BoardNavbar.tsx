import BoardTitleForm from "@/components/form/BoardTitleForm";
import React from "react";
import BoardOptions from "./BoardOptions";
import { auth } from "@clerk/nextjs";

const BoardNavbar = ({ board }: { board: any }) => {
  const { orgId } = auth();
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm board={JSON.parse(JSON.stringify(board))} orgId={orgId} />
      <div className="ml-auto">
        <BoardOptions board={JSON.parse(JSON.stringify(board))} />
      </div>
    </div>
  );
};

export default BoardNavbar;
