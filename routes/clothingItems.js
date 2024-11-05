const router = require('express').Router();

const { createItem, getItems, deleteItem, likeItem } = require('../controllers/clothingItems');


// create
router.post('/', createItem);

// read
router.get('/', getItems);

// update


// like an item
router.patch('/:idemId/like', likeItem);

// delete
router.delete('/:itemId', deleteItem);


module.exports = router;