const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="happy">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the inventory detail view HTML
 * ************************************ */
Util.buildInventoryDetail = async function (data) {
  let detail;
  if (data.length === 0) {
    const error = new Error();
    error.status = 404;
  } else {
    detail = '<div id="container-item-details">';
    detail += '<div id="inv-detail-img">';
    detail += '<img src="' + data[0].inv_image + '" alt="Image of ' + data[0].inv_make + ' ' + data[0].inv_model + ' on CSE Motors">';
    detail += "<hr id='details-divider'>";
    detail += "</div>";
    detail += '<div id="item-info">';
    detail += '<ul id="item-info-list">';
    detail += '<li id="item-price"><span class="item-header">Price: </span>$' +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) + "</li>";
    detail +=
      '<li id="item-detail-desc"> <span class="item-header"> Description: </span>' +
      data[0].inv_description +
      "</li>";
    detail +=
      '<li id="item-detail-color"> <span class="item-header"> Color: </span>' +
      data[0].inv_color +
      "</li>";
    detail +=
      '<li id="item-detail-year"> <span class="item-header"> Year: </span>' +
      data[0].inv_year +
      "</li>";
    detail +=
      '<li id="item-detail-miles"> <span class="item-header"> Miles: </span>' +
      new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
      "</li>";

    detail += "</ul>";
    detail += "</div>";
    detail += "</div>";
    return detail;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
