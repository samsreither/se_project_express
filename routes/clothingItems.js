const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem, dislikeItem, updateItem } = require('../controllers/clothingItems');


// create
router.post('/', createItem);

// read
router.get('/', getItems);

// update
router.put('/:itemId', updateItem)

// like an item
router.put('/:itemId/likes', likeItem);

// unlike an item
router.delete('/:itemId/likes', dislikeItem);

// delete
router.delete('/:itemId', deleteItem);


module.exports = router;