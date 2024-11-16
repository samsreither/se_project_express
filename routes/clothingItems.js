const router = require('express').Router();

const { createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItems');

// import validation middleware
const {
  validateCardBody,
  validateId,
} = require('../middlewares/validation');

// create
router.post('/', validateCardBody, createItem);

// like an item
router.put('/:itemId/likes', validateId, likeItem);

// unlike an item
router.delete('/:itemId/likes', validateId, dislikeItem);

// delete
router.delete('/:itemId', validateId, deleteItem);


module.exports = router;