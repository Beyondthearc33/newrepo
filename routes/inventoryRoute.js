const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");
const { handleErrors } = require("../utilities");

router.get(
  "/type/:classificationId",
  handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:invId",
  handleErrors(invController.buildByInventoryId)
);

router.get(
  "/error",
  handleErrors(invController.error)
);

router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.buildManagement)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.getInventoryJSON)
);

router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  handleErrors(invController.addInventory)
);

router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.editInventoryView)
);

router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.buildDeleteConfirm)
);

router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  handleErrors(invController.deleteInventoryItem)
);

module.exports = router;