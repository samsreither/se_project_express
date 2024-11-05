const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem, updateItem } = require('../controllers/clothingItems');


// create
router.post('/', createItem);

// read
router.get('/', getItems);

// update
router.put('/:itemId', updateItem)

// like an item
router.put('/:itemId/likes', likeItem);

// delete
router.delete('/:itemId', deleteItem);


module.exports = router;