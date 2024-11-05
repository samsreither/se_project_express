const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// create clothing item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

// return all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(SERVER_ERROR).send({ message: "Error from getItems", e });
    });
};

// delete an item by _id
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Error deleting item" });
      }
    });
};

// like an item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // check if itemId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" }); // Handle invalid ID format
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      // check if user has already liked the item
      const hasLiked = item.likes.includes(userId);

      if (hasLiked) {
        // If already liked, remove the user from likes
        item.likes = item.likes.filter((like) => !like.equals(userId));
        return item
          .save()
          .then(() =>
            res.status(200).send({ message: "Like removed", data: item })
          );
      } else {
        // If not liked, add the user to likes
        item.likes.push(userId);
        return item
          .save()
          .then(() =>
            res.status(200).send({ message: "Item liked", data: item })
          );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "Error liking item" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem
};
