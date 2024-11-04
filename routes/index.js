const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsroutes = require("./clothingItems");

router.use("/users", userRouter);
router.use("/clothingItems", clothingItemsroutes);

module.exports = router;