const router = require('express').Router();

const { createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItems');


// create
router.post('/', createItem);

// like an item
router.put('/:itemId/likes', likeItem);

// unlike an item
router.delete('/:itemId/likes', dislikeItem);

// delete
router.delete('/:itemId', deleteItem);


module.exports = router;