import update from "immutability-helper";
import { memo, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { Card } from "./Card.jsx";
import { ItemTypes } from "./ItemTypes.js";

const style = {
  width: 200,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
};
const ITEMS = [
  {
    id: 1,
    src: "/image-1.webp",
  },
  {
    id: 2,
    src: "/image-2.webp",
  },
  {
    id: 3,
    src: "/image-3.webp",
  },
  {
    id: 4,
    src: "/image-4.webp",
  },
  {
    id: 5,
    src: "/image-5.webp",
  },
  {
    id: 6,
    src: "/image-6.webp",
  },
  {
    id: 7,
    src: "/image-7.webp",
  },
];
const Container = memo(function Container() {
  const [cards, setCards] = useState(ITEMS);
  const findCard = useCallback(
    (id) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );
  const moveCard = useCallback(
    (id, atIndex) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards]
  );
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <div className="grid" ref={drop} style={style}>
      {cards.map((card) => (
        <Card
          key={card.id}
          id={`${card.id}`}
          moveCard={moveCard}
          findCard={findCard}
          src={card.src}
        />
      ))}
    </div>
  );
});

export default Container;
