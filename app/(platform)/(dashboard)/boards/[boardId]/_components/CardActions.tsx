"use client";
import { Button } from "@/components/ui/button";
import { copyCard, deleteCard } from "@/lib/actions/card.action";
import { useUser } from "@clerk/nextjs";
import { DialogClose } from "@radix-ui/react-dialog";
import { Copy, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const CardActions = ({ card, listId }: { card: any; listId: string }) => {
  const pathname = usePathname();

  const [deleting, setDeleting] = useState(false);
  const [copying, setCopying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { user } = useUser();

  const handleClick = async (type: string) => {
    if (type === "copy") {
      setCopying(true);
      await copyCard({
        cardId: card._id,
        listId,
        pathname,
        userId: user?.id,
        userImage: user?.imageUrl,
        username: user?.fullName,
      });
      setCopying(false);
      toast.success(`Card "${card.title + " - copy"}" created`);
      closeRef.current?.click();
    }
    if (type === "delete") {
      setDeleting(true);
      await deleteCard({
        cardId: card._id,
        listId,
        pathname,
        userId: user?.id,
        userImage: user?.imageUrl,
        username: user?.fullName,
      });
      setDeleting(false);
      toast.success(`Card "${card.title}" deleted`);
      closeRef.current?.click();
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        disabled={copying}
        variant="gray"
        className="w-full justify-start disabled:cursor-not-allowed disabled:opacity-60"
        size="inline"
        onClick={() => {
          handleClick("copy");
        }}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <DialogClose>
        <Button ref={closeRef} className="hidden"></Button>
      </DialogClose>
      <Button
        disabled={deleting}
        variant="gray"
        className="w-full justify-start disabled:cursor-not-allowed disabled:opacity-60"
        size="inline"
        onClick={(e) => {
          handleClick("delete");
        }}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default CardActions;
