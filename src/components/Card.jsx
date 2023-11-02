/* eslint react/prop-types: 0 */

import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";

import { ItemTypes } from "./ItemTypes";

const Card = memo(function Card({
  id,
  moveCard,
  findCard,
  src,
  setDeleteCard,
}) {
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

  function handleCheckBox(event) {
    // Getting the value of checkbox and id of the image that is checked, also making it number so can match later to delete
    let isChecked = event.target.checked;
    let id = parseInt(event.target.id);

    setDeleteCard((prev) => {
      if (isChecked) {
        // If checkbox is checked, add id to the array to delete on button click
        return [...prev, id];
      } else {
        // If checkbox is unchecked, remove id from the array to remove
        return prev.filter((itemId) => itemId !== id);
      }
    });
  }

  return (
    <div
      className="featured-image"
      ref={(node) => drag(drop(node))}
      style={{ opacity }}
    >
      {/* Wrapping label around image to make whole image checkbox */}
      <label htmlFor={id}>
        <img className="image" src={src} alt="" />
      </label>
      <input
        onChange={(event) => handleCheckBox(event)}
        type="checkbox"
        name="image-inputbox"
        id={id}
      />
      {/* Overlay defined in this div */}
      <div className="image-overlay"></div>
    </div>
  );
});

export default Card;
