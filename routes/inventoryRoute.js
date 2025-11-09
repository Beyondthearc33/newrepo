// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
// const invCont = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

const { handleErrors } = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  handleErrors(invController.buildByClassificationId)
);

// Route to build inventory Detail view
router.get("/detail/:invId", handleErrors(invController.buildByInventoryId));

router.get("/error", handleErrors(invController.error));

router.get("/", handleErrors(invController.buildManagement));

router.get(
  "/add-classification",
  handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.addInventory)
)

module.exports = router;
