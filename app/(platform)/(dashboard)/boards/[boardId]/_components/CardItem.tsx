"use client";
import { Draggable } from "@hello-pangea/dnd";
import React from "react";

interface Props {
  index: number;
  card: any;
  listName: string;
  listId: string;
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardHeader from "./CardHeader";
import CardDescription from "./CardDescription";
import CardActions from "./CardActions";
import CardActivity from "./CardActivity";
import { useFetchActivities } from "@/customHooks/fetchCardActivities";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

const CardItem = ({ index, card, listName, listId }: Props) => {
  const { activities, loading, error, refetch } = useFetchActivities({
    cardId: card._id,
  });

  return (
    <Dialog>
      <DialogTrigger className="text-start">
        <Draggable draggableId={card._id} index={index}>
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
            >
              {card.title}
            </div>
          )}
        </Draggable>
      </DialogTrigger>
      <DialogContent className="max-h-[75vh] overflow-y-scroll custom-scrollbar">
        <DialogClose className="absolute z-[51] right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
        </DialogClose>
        <CardHeader card={card} listName={listName} refetch={refetch} />
        <div className="flex items-start gap-3 justify-between max-sm:flex-col">
          <CardDescription card={card} refetch={refetch} />
          <CardActions card={card} listId={listId} />
        </div>
        {loading === true ? (
          <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
              <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
              <Skeleton className="w-full h-10 bg-neutral-200" />
            </div>
          </div>
        ) : (
          <CardActivity activities={activities} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardItem;
