"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { deleteBoard } from "@/lib/actions/board.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const BoardOptions = ({ board }: { board: any }) => {
  const navigate = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { user } = useUser();

  const handleDelete = async () => {
    setDeleting(true);
    await deleteBoard({
      boardId: board._id,
      orgId: board.organizationId,
      userId: user?.id,
      username: user?.fullName,
      userImage: user?.imageUrl,
    });
    setDeleting(false);
    toast.success("Board deleted Successfully");
    navigate.push("/organization/" + board.organizationId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className=" h-auto w-auto p-2 hover:bg-white/20 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-neutral-600 text-center pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-center font-normal text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          Delete this Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
