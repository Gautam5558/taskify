"use client";
import React, { useEffect, useState } from "react";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { updateListorder } from "@/lib/actions/list.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { updateCardsOrder } from "@/lib/actions/card.action";

interface Props {
  boardId: string;
  data: any;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const ListContainer = ({ boardId, data }: Props) => {
  const [orderedData, setOrderedData] = useState(data);
  const pathname = usePathname();

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const handleDrag = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item: any, index) => ({ ...item, order: index })
      );
      setOrderedData(items);

      await updateListorder({ updatedListsByOrder: items, pathname, boardId });
      toast.success("lists reordered");
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list

      const sourceList = newOrderedData.find((list) => {
        return list._id === source.droppableId;
      });
      const destList = newOrderedData.find((list) => {
        return list._id === destination.droppableId;
      });

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card: any, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        await updateCardsOrder({
          updatedCardsOrderArray: reorderedCards,
          pathname,
        });
        toast.success("Cards reordered");
      } else {
        // User moves the card from one list to another

        //First remove card from source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card: any, index: number) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destList.cards.forEach((card: any, index: number) => {
          card.order = index;
        });
        setOrderedData(newOrderedData);
        await updateCardsOrder({
          updatedCardsOrderArray: sourceList.cards,
          pathname,
          listId: sourceList._id,
          type: "source",
          movedCardId: movedCard._id,
        });
        await updateCardsOrder({
          updatedCardsOrderArray: destList.cards,
          pathname,
          listId: destList._id,
          type: "destination",
          movedCardId: movedCard._id,
        });
        toast.success("Cards reordered");
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list: any, index: number) => {
              return <ListItem key={list._id} list={list} index={index} />;
            })}
            {provided.placeholder}
            <ListForm boardId={boardId} />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
