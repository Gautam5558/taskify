"use client";
import React, { useEffect, useState } from "react";
import ListForm from "./ListForm";
import ListItem from "./ListItem";

interface Props {
  boardId: string;
  data: any;
}

const ListContainer = ({ boardId, data }: Props) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list: any, index: number) => {
        return <ListItem key={list._id} list={list} index={index} />;
      })}
      <ListForm boardId={boardId} />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};

export default ListContainer;
