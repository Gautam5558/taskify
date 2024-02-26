import { getListsFromBoardId } from "@/lib/actions/list.action";
import React from "react";
import ListContainer from "./_components/ListContainer";
import { auth } from "@clerk/nextjs";

const BoardPage = async ({ params }: { params: { boardId: string } }) => {
  const { lists }: any = await getListsFromBoardId({ boardId: params.boardId });
  const { orgId } = auth();

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId.toString()}
        data={JSON.parse(JSON.stringify(lists))}
        orgId={orgId?.toString()}
      />
    </div>
  );
};

export default BoardPage;
