import { getListsFromBoardId } from "@/lib/actions/list.action";
import React from "react";
import ListContainer from "./_components/ListContainer";

const BoardPage = async ({ params }: { params: { boardId: string } }) => {
  const { lists }: any = await getListsFromBoardId({ boardId: params.boardId });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId.toString()}
        data={JSON.parse(JSON.stringify(lists))}
      />
    </div>
  );
};

export default BoardPage;
