import { memo, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { PhotoIcon } from "@heroicons/react/24/outline";

import update from "immutability-helper";
import Card from "./Card.jsx";
import { ItemTypes } from "./ItemTypes.js";

const gallery_images = [
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
  {
    id: 8,
    src: "/image-8.webp",
  },
  {
    id: 9,
    src: "/image-9.webp",
  },
  {
    id: 10,
    src: "/image-10.jpeg",
  },
  {
    id: 11,
    src: "/image-11.jpeg",
  },
];
const Gallery = memo(function Container() {
  const [cards, setCards] = useState(gallery_images);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteCard, setDeleteCard] = useState([]);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  function handleDelete() {
    if (
      window.confirm(
        `Delete ${deleteCard.length} ${
          deleteCard.length === 1 ? "Item" : "Items"
        }?`
      )
    ) {
      deleteCard.forEach((id) => {
        const index = gallery_images.findIndex((item) => item.id === id);
        if (index !== -1) {
          gallery_images.splice(index, 1);
        }
      });
      // Update state with the modified items array
      setCards([...gallery_images]);
      setDeleteCard([]);
    }
  }

  return (
    <section className="gallery-section">
      <div className="heading">
        {deleteCard.length > 0 ? (
          <>
            <h1>
              {" "}
              {deleteCard.length} {deleteCard.length === 1 ? "Item" : "Items"}{" "}
              Selected
            </h1>
            <button onClick={handleDelete} className="delete-button">
              Delete {deleteCard.length}{" "}
              {deleteCard.length === 1 ? "File" : "Files"}
            </button>
          </>
        ) : (
          <h1> Gallery</h1>
        )}
      </div>
      {cards.length > 0 ? (
        <div className="gallery-layout" ref={drop}>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={`${card.id}`}
              moveCard={moveCard}
              findCard={findCard}
              src={card.src}
              setDeleteCard={setDeleteCard}
            />
          ))}
          <label className="add-image" htmlFor="add-image-file">
            <div className="add-image-file">
              {selectedImage ? (
                <img
                  className="preview-image"
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                />
              ) : (
                <>
                  <PhotoIcon className="image-upload-icon" />
                  <span>Add Images</span>
                </>
              )}
              <input
                type="file"
                name="add-image-file"
                id="add-image-file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </label>
        </div>
      ) : (
        <div className="empty-state">
          <h1>No image found in the gallery. </h1>
          <img src="/empty-state.png" alt="no-products" />
        </div>
      )}
    </section>
  );
});

export default Gallery;
