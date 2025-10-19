const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

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

module.exports = invCont;
