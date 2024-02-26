"use client";
import React, { useRef, useState } from "react";
import ListHeader from "./ListHeader";
import CardForm from "./CardForm";
import { cn } from "@/lib/utils";
import CardItem from "./CardItem";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface Props {
  list: any;
  index: number;
  orgId: string | null | undefined;
}

const ListItem = ({ list, index, orgId }: Props) => {
  const [isCardForm, setIsCardForm] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // This function is called when we click on the ADD card button to convert it to a card form
  const clickingAddCardButton = () => {
    setIsCardForm(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const clickingCloseCardFormButton = () => {
    setIsCardForm(false);
  };

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => {
        return (
          <li
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="shrink-0 h-full w-[272px] select-none"
          >
            <div
              {...provided.dragHandleProps}
              className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
            >
              <ListHeader
                list={list}
                clickingAddCardButton={clickingAddCardButton}
                orgId={orgId}
              />
              <Droppable droppableId={list._id} type="card">
                {(provided) => (
                  <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                      list.cards.length > 0 ? "mt-2" : "mt-0"
                    )}
                  >
                    {list.cards.map((card: any, index: number) => {
                      return (
                        <CardItem
                          key={card._id}
                          card={card}
                          index={index}
                          listName={list.title}
                          listId={list._id}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
              <CardForm
                isCardForm={isCardForm}
                ref={textAreaRef}
                clickingAddCardButton={clickingAddCardButton}
                clickingCloseCardFormButton={clickingCloseCardFormButton}
                listId={list._id}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
