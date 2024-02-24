import React from "react";

interface Props {
  index: number;
  card: any;
}

const CardItem = ({ index, card }: Props) => {
  return (
    <div className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm">
      {card.title}
    </div>
  );
};

export default CardItem;
