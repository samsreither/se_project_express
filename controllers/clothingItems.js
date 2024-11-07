const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, NO_PERMISSION, OK_RESPONSE, OK_CREATE } = require("../utils/errors");

// create clothing item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(OK_CREATE).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        console.error(err);
        res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
      }
    });
};

// return all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_RESPONSE).send(items))
    .catch((e) => {
      console.error(e);
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

// update items
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK_RESPONSE).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

// delete an item by _id
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .then((item) => {
      // if item doesn't exist, return 404 error
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      // check if logged-in user is the owner of the item
      if (item.owner.toString() !== req.user._id.toString()) {
        // if user isn't the owner, return a 403 forbidden error
        return res.status(NO_PERMISSION).send({ message: "You do not have permission to delete this item"});
      }

      // delete the item if user is the owner
      return item.remove()
        .then(() => res.status(OK_RESPONSE).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });

    });
};

// like an item by _id
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // Add userId to likes if not already present
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK_RESPONSE).send({ message: "Item liked", data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
}

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // Remove userId from likes
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(OK_RESPONSE).send({ message: "Like removed", data: item });
    })
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem
};
