const express = require("express");
const controller = require("../controllers/listing.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", controller.getAllListings);

router.get("/my-listings", authenticateToken, controller.getMyListings);
router.post("/", authenticateToken, controller.createListing);
router.put("/:id", authenticateToken, controller.updateListing);
router.delete("/:id", authenticateToken, controller.deleteListing);

router.get("/:id", controller.getListingById);
module.exports = router;