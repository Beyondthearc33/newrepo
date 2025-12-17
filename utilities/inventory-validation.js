// utilities/inventory-validation.js
const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const invValidate = {}

/* **********************************
 *  Add Classification Rules
 * ********************************* */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers (no spaces or special characters).")
      .custom(async (classification_name) => {
        const exists = await invModel.checkExistingClassification(classification_name)
        if (exists) {
          throw new Error("That classification already exists.")
        }
      }),
  ]
}

/* **********************************
 *  Check Classification Data
 * ********************************* */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const { classification_name = "" } = req.body

      return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name,
    })
  }
  next()
}

/* **********************************
 *  Add Inventory Rules
 * ********************************* */
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty().withMessage("Please choose a classification.")
      .isInt({ min: 1 }).withMessage("Invalid classification selection."),

    body("inv_make")
      .trim().escape()
      .isLength({ min: 2, max: 50 })
      .withMessage("Make must be between 2 and 50 characters."),

    body("inv_model")
      .trim().escape()
      .isLength({ min: 2, max: 50 })
      .withMessage("Model must be between 2 and 50 characters."),

    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be between 1900 and 2100."),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative integer."),

    body("inv_color")
      .trim().escape()
      .isLength({ min: 3, max: 30 })
      .withMessage("Color must be 3–30 letters."),

    body("inv_image")
      .trim().escape()
      .isLength({ min: 1 })
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim().escape()
      .isLength({ min: 1 })
      .withMessage("Thumbnail path is required."),

    body("inv_description")
      .trim().escape()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters.")
  ]
}

/* **********************************
 *  Check Inventory Data
 * ********************************* */
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)

    const sticky = {
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price: req.body.inv_price || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id || ""
    }

      return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      ...sticky
    })
  }
  next()
}

/* **********************************
 *  Check Update Data (return to edit view)
 * ********************************* */
invValidate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    const itemName = `${req.body.inv_make} ${req.body.inv_model}`

    const sticky = {
      inv_id: req.body.inv_id || "",
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_year: req.body.inv_year || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.png",
      inv_price: req.body.inv_price || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id || ""
    }

    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      ...sticky
    })
  }
  next()
}


module.exports = invValidate