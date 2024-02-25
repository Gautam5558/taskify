import { Draggable } from "@hello-pangea/dnd";
import React from "react";

interface Props {
  index: number;
  card: any;
}

const CardItem = ({ index, card }: Props) => {
  return (
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
  );
};

export default CardItem;
