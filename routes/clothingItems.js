const express = require('express');
const router = express.Router();
const clothingItemsController = require('../controllers/clothingItems');

router.post('/', clothingItemsController.createClothingItem);
router.get('/', clothingItemsController.getClothingItems);
router.get('/:id', clothingItemsController.getClothingItemById);
router.put('/:id', clothingItemsController.updateClothingItem);
router.delete('/:id', clothingItemsController.deleteClothingItem);
router.put('/:itemId/likes', clothingItemsController.likeClothingItem);
router.delete('/:itemId/likes', clothingItemsController.dislikeClothingItem);

module.exports = router;