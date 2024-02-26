"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { copyListByListId, deleteList } from "@/lib/actions/list.action";
import { useUser } from "@clerk/nextjs";
import { MoreHorizontal, X } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  list: any;
  clickingAddCardButton: () => void;
  orgId: string | null | undefined;
}

const ListOptions = ({ list, clickingAddCardButton, orgId }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [copying, setCopying] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const params = useParams();
  const { boardId } = params;
  const { user } = useUser();

  const handleDeleteList = async () => {
    setDeleting(true);
    await deleteList({
      listId: list._id,
      pathname,
      boardId: params.boardId,
      userId: user?.id,
      userImage: user?.imageUrl,
      username: user?.fullName,
      orgId,
    });
    setDeleting(false);
    buttonRef.current?.click();
    toast.success("List deleted successfully");
  };

  const handleListCopy = async () => {
    setCopying(true);
    await copyListByListId({
      listId: list._id,
      pathname,
      boardId: boardId,
      userId: user?.id,
      userImage: user?.imageUrl,
      username: user?.fullName,
      orgId,
    });
    setCopying(false);
    buttonRef.current?.click();
    toast.success("List copied successfully");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className=" h-auto w-auto p-2 hover:bg-white/20 hover:text-neutral-600"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-neutral-600 text-center pb-4">
          List Actions
        </div>
        <Separator />
        <PopoverClose asChild>
          <Button
            ref={buttonRef}
            variant="ghost"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={() => {
            clickingAddCardButton();
            buttonRef.current?.click();
          }}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-center font-normal text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Card
        </Button>
        <Separator />
        <Button
          disabled={copying}
          onClick={() => {
            handleListCopy();
          }}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-center font-normal text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy this list
        </Button>
        <Separator />
        <Button
          disabled={deleting}
          onClick={(e) => {
            handleDeleteList();
          }}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-center font-normal text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete list
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
