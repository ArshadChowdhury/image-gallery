import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

// eslint-disable-next-line react/prop-types
export const Card = memo(function Card({ id, moveCard, findCard, src }) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1;
  return (
    <>
      {/* <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
        <img className="image" src={src} alt="" />
      </div> */}
      <div
        className="featured-image"
        ref={(node) => drag(drop(node))}
        style={{ opacity }}
      >
        <img className="image" src={src} alt="" />
      </div>
    </>
  );
});
