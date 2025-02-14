const db = require("../database");

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const result = await db.query(sql);

    if (!result || !result.rows) {
      console.error("Error: Query returned no data.");
      return [];
    }

    return result.rows;
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

    if (!result.rows.length) {
      console.error(
        `Error: No classification found for ID ${classificationId}`
      );
      return null;
    }

    return result.rows[0]; // ✅ Return only one result
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

module.exports = {
  getClassifications,
  getClassificationById,
  getInventoryByClassificationId,
};
