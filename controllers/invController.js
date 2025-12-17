const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    if (!data || data.length === 0) {
      req.flash("notice", "Sorry, no vehicles were found for this classification.")
      return res.status(404).render("inventory/classification", {
        title: "No Vehicles Found",
        nav,
        grid: "<p class='notice'>No vehicles available for this classification.</p>",
      })
    }

    const className = data[0].classification_name
    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("buildByClassificationId error:", error)
    next(error)
  }
}

/* ***************************
 *  Build inventory details by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  console.log("Step 1");
  const inventory_id = req.params.invId;
  console.log("Step 2");
  console.log(`${inventory_id}`)
  const data = await invModel.getDetailByInventoryId(inventory_id);
  console.log("Step 3");
  const detail = await utilities.buildInventoryDetail(data);
  console.log(`${data}`)
  console.log("Step 4");
  let nav = await utilities.getNav();
  console.log("Step 5");
  const title =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
    console.log("Step 6");
  res.render("./inventory/detail", {
    title: title,
    nav,
    detail,
  });
};

invCont.error = async function (req, res, next) {
  const error = new Error("INTENTIONAL ERROR - INTENTIONAL ERROR - INTENTIONAL ERROR - INTENTIONAL ERROR");
  error.status = 500;
  throw error;
};

/* ****************************************
*  Deliver Inventory Management view
* *************************************** */
async function buildManagement(req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
  })
}
/* ****************************************
*  Deliver Add Classification view
* *************************************** */
async function buildAddClassification(req, res, next) {
  const nav = await utilities.getNav() 
  return res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,               
    classification_name: ""
  })
}

/* ****************************************
*  Process Add Classification
* *************************************** */
async function addClassification(req, res, next) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      const freshNav = await utilities.getNav()
      req.flash("notice", "Classification added successfully.")
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: freshNav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, adding the classification failed.")
      return res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name
      })
    }
  } catch (error) {
    console.error("addClassification error:", error)
    req.flash("notice", "Sorry, there was a problem saving the classification.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    })
  }
}

/* ****************************************
*  Deliver Add Inventory view (GET)
* *************************************** */
async function buildAddInventory(req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  return res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,

    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  })
}

/* ****************************************
*  Process Add Inventory (POST)
* *************************************** */
async function addInventory(req, res, next) {
  const nav = await utilities.getNav()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  try {
    const result = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })

    if (result) {
      const freshNav = await utilities.getNav()
      req.flash("notice", "Vehicle added successfully.")
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav: freshNav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.")
      const classificationList = await utilities.buildClassificationList(classification_id)
      return res.status(500).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      })
    }
  } catch (error) {
    console.error("addInventory error:", error)
    req.flash("notice", "Sorry, there was a problem saving the vehicle.")
    const classificationList = await utilities.buildClassificationList(classification_id)
    return res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  // Get the inventory item data
  const itemData = await invModel.getInventoryById(inv_id) // <-- adjust name if needed

  // Build the classification select with the current classification selected
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,

    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ***************************
 *  Process inventory update
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory({
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })

  if (updateResult) {
    req.flash("notice", "Vehicle updated successfully.")
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    res.status(500).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: [{ msg: "Update failed. Please try again." }],
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 *  Process inventory deletion
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "Vehicle was successfully deleted.")
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inv/delete/${inv_id}`)
  }
}



module.exports = {
  buildByClassificationId: invCont.buildByClassificationId,
  buildByInventoryId: invCont.buildByInventoryId,
  error: invCont.error,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  getInventoryJSON: invCont.getInventoryJSON,
  editInventoryView: invCont.editInventoryView,
  updateInventory: invCont.updateInventory,
  buildDeleteConfirm: invCont.buildDeleteConfirm,
  deleteInventoryItem: invCont.deleteInventoryItem,
}


