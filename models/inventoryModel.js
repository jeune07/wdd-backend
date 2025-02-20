const db = require("../database");

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await db.query(sql);

    console.log("Fetched classifications:", result.rows); // ✅ Debugging log

    return result.rows || [];
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error;
  }
}

/* ***************************
 *  Get classification by ID
 * ************************** */
async function getClassificationById(classificationId) {
  try {
    const sql =
      "SELECT classification_name FROM classification WHERE classification_id = $1";
    const result = await db.query(sql, [classificationId]);
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching classification name:", error);
    throw error;
  }
}

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classificationId) {
  try {
    const sql = "SELECT * FROM inventory WHERE classification_id = $1";
    const result = await db.query(sql, [classificationId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await db.query(sql, [vehicleId]);
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw error;
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    await db.query(sql, [classification_name]);
    return true;
  } catch (error) {
    console.error("Error adding classification:", error);
    return false;
  }
}

/* ***************************
 *  Add a new vehicle
 * ************************** */
async function addInventory(vehicleData) {
  try {
    console.log("Inserting vehicle into database:", vehicleData);

    const sql = `
      INSERT INTO inventory (classification_id, inv_make, inv_model, inv_price, inv_year, inv_miles, inv_color, inv_image, inv_thumbnail, inv_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `;

    const result = await db.query(sql, [
      vehicleData.classification_id,
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_price,
      vehicleData.inv_year || 2023, // Default year if missing
      vehicleData.inv_miles || 0, // Default mileage if missing
      vehicleData.inv_color || "Unknown",
      vehicleData.inv_image || "/images/no-image.jpg",
      vehicleData.inv_thumbnail || "/images/no-image.jpg",
      vehicleData.inv_description || "No description provided.",
    ]);

    console.log("Inserted vehicle:", result.rows[0]);
    return true;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return false;
  }
}

module.exports = { addInventory };

module.exports = { addInventory };

module.exports = { addInventory };

module.exports = {
  getClassifications,
  getClassificationById,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory, // ✅ Added this function
};
