import Hint from "@/components/Hint";
import BoardPopover from "@/components/form/BoardPopover";
import { Skeleton } from "@/components/ui/skeleton";
import { getBoardsByOrganizationId } from "@/lib/actions/board.action";
import { auth } from "@clerk/nextjs";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";

import React, { Suspense } from "react";

const BoardList = async ({ organizationId }: { organizationId: string }) => {
  const { boards }: any = await getBoardsByOrganizationId({ organizationId });
  const { orgId } = auth();

  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <Suspense fallback={<BoardList.Skeleton />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board: any) => {
            return (
              <Link
                href={"/boards/" + board._id}
                key={boards._id}
                className="group relative aspect-video  bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                <p className="relative font-semibold text-white">
                  {board.title}
                </p>
              </Link>
            );
          })}
          <BoardPopover side="right" sideOffset={40} orgId={orgId}>
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition "
            >
              <p className="text-sm">Create New board</p>
              <span className="text-xs">5 remaining</span>
              <Hint
                sideOffset={40}
                description="Free Workspaces can have upto 5 open boards. For unlimited boards upgrade this workspace."
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </BoardPopover>
        </div>
      </Suspense>
    </div>
  );
};

export default BoardList;

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
