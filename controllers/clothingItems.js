const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  OK_RESPONSE,
  OK_CREATE,
} = require("../utils/errors");
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

// create clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(OK_CREATE).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for creating an item"));
      } else {
        next(err); // pass unexpected errors to error handler
      }
    });
};

// return all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_RESPONSE).send(items))
    .catch(next); // pass errors to error handler
};

// delete an item by _id
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .then((item) => {
      // if item doesn't exist, return 404 error
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      // check if logged-in user is the owner of the item
      if (item.owner.toString() !== req.user._id.toString()) {
        // if user isn't the owner, return a 403 forbidden error
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      // delete the item if user is the owner
      return item
        .remove()
        .then(() =>
          res.status(OK_RESPONSE).send({ message: "Item deleted successfully" })
        );
    })
    .catch(next);
};

// like an item by _id
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // Add userId to likes if not already present
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) =>
      res.status(OK_RESPONSE).send({ message: "Item liked", data: item })
    )
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // Remove userId from likes
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      res.status(OK_RESPONSE).send({ message: "Like removed", data: item });
    })
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
