const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getDetailByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
      return data.rows
  } catch(error) {
    console.error("getiventorybyid error" + error)
  }
}

/* ***************************
 *  Check if classification exists
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT classification_id FROM classification WHERE classification_name = $1"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error checking classification:", error)
    throw error
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING classification_id;
    `
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error adding classification:", error)
    throw error
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO public.inventory (
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
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `
    const result = await pool.query(sql, [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addInventory query error:", error)
    return null
  }
}

async function updateInventory(invData) {
  const sql = `
    UPDATE inventory
    SET inv_make = $1,
        inv_model = $2,
        inv_year = $3,
        inv_description = $4,
        inv_image = $5,
        inv_thumbnail = $6,
        inv_price = $7,
        inv_miles = $8,
        inv_color = $9,
        classification_id = $10
    WHERE inv_id = $11
    RETURNING *
  `
  const data = await pool.query(sql, [
    invData.inv_make,
    invData.inv_model,
    invData.inv_year,
    invData.inv_description,
    invData.inv_image,
    invData.inv_thumbnail,
    invData.inv_price,
    invData.inv_miles,
    invData.inv_color,
    invData.classification_id,
    invData.inv_id
  ])
  return data.rowCount
}

/* ***************************
 *  Get Inventory Item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error:", error)
    throw error
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
  const data = await pool.query(sql, [inv_id])
  return data.rowCount
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailByInventoryId,  getInventoryById, checkExistingClassification, addClassification, addInventory, updateInventory, deleteInventoryItem}