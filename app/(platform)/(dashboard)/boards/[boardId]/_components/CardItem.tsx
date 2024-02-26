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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardHeader from "./CardHeader";
import CardDescription from "./CardDescription";
import CardActions from "./CardActions";

const CardItem = ({ index, card, listName, listId }: Props) => {
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
      <DialogContent>
        <CardHeader card={card} listName={listName} />
        <div className="flex items-start gap-3 justify-between max-sm:flex-col">
          <CardDescription card={card} />
          <CardActions card={card} listId={listId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardItem;
