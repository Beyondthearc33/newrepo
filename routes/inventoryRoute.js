// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
// const invCont = require("../controllers/invController");
const { handleErrors } = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", handleErrors(invController.buildByClassificationId));

// Route to build inventory Detail view
router.get('/detail/:invId', handleErrors(invController.buildByInventoryId));

router.get("/error", handleErrors(invController.error));


module.exports = router;