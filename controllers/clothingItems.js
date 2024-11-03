const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Create a new clothing item
const createClothingItem = async (req, res) => {
    try {
        const clothingItem = new ClothingItem(req.body);
        await clothingItem.save();
        res.status(201).json(clothingItem);
    } catch (error) {
        console.error(error); // Log the error
        if (error.name === 'ValidationError') {
            return res.status(BAD_REQUEST).json({ message: "Invalid data passed for clothing item creation." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Get all clothing items
const getClothingItems = async (req, res) => {
    try {
        const clothingItems = await ClothingItem.find();
        res.status(200).json(clothingItems);
    } catch (error) {
        console.error(error); // Log the error
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Get a clothing item by ID
const getClothingItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const clothingItem = await ClothingItem.findById(id).orFail(() => {
            const error = new Error("Clothing item not found");
            error.status = NOT_FOUND;
            throw error;
        });

        res.status(200).json(clothingItem);
    } catch (error) {
        console.error(error); // Log the error
        if (error.status === NOT_FOUND) {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Update a clothing item by ID
const updateClothingItem = async (req, res) => {
    const { id } = req.params;
    try {
        const clothingItem = await ClothingItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .orFail(() => {
                const error = new Error("Clothing item not found");
                error.status = NOT_FOUND;
                throw error;
            });

        res.status(200).json(clothingItem);
    } catch (error) {
        console.error(error); // Log the error
        if (error.status === NOT_FOUND) {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found." });
        } else if (error.name === 'ValidationError') {
            return res.status(BAD_REQUEST).json({ message: "Invalid data passed for clothing item update." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Delete a clothing item by ID
const deleteClothingItem = async (req, res) => {
    const { id } = req.params;
    try {
        const clothingItem = await ClothingItem.findByIdAndDelete(id).orFail(() => {
            const error = new Error("Clothing item not found");
            error.status = NOT_FOUND;
            throw error;
        });

        res.status(204).send();
    } catch (error) {
        console.error(error); // Log the error
        if (error.status === NOT_FOUND) {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Like a clothing item
const likeClothingItem = async (req, res) => {
    const { itemId } = req.params; // Access the item ID from the request parameters
    try {
        const clothingItem = await ClothingItem.findByIdAndUpdate(
            itemId,
            { $addToSet: { likes: req.user._id } }, // Add the user's ID to the likes array if not already present
            { new: true }
        ).orFail(() => {
            const error = new Error("Clothing item not found");
            error.status = NOT_FOUND;
            throw error;
        });

        res.status(200).json(clothingItem);
    } catch (error) {
        console.error(error); // Log the error
        if (error.status === NOT_FOUND) {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

// Unlike a clothing item
const dislikeClothingItem = async (req, res) => {
    const { itemId } = req.params; // Access the item ID from the request parameters
    try {
        const clothingItem = await ClothingItem.findByIdAndUpdate(
            itemId,
            { $pull: { likes: req.user._id } }, // Remove the user's ID from the likes array
            { new: true }
        ).orFail(() => {
            const error = new Error("Clothing item not found");
            error.status = NOT_FOUND;
            throw error;
        });

        res.status(200).json(clothingItem);
    } catch (error) {
        console.error(error); // Log the error
        if (error.status === NOT_FOUND) {
            return res.status(NOT_FOUND).json({ message: "Clothing item not found." });
        }
        res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    }
};

module.exports = {
    createClothingItem,
    getClothingItems,
    getClothingItemById,
    updateClothingItem,
    deleteClothingItem,
    likeClothingItem,
    dislikeClothingItem,
};