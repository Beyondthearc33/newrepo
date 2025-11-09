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
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
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

// module.exports = { invCont, buildManagement, buildAddClassification, addClassification, buildAddInventory, addInventory };
module.exports = {
  buildByClassificationId: invCont.buildByClassificationId,
  buildByInventoryId: invCont.buildByInventoryId,
  error: invCont.error,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
}