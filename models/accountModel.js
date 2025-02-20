const db = require("../database");

/* ***************************
 *  Get account by email
 * ************************** */
async function getAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM accounts WHERE account_email = $1";
    const result = await db.query(sql, [email]);

    if (!result.rows.length) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
}

/* ***************************
 *  Update user account info
 * ************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE accounts 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4 RETURNING *;
    `;
    await db.query(sql, [firstname, lastname, email, account_id]);
    return true;
  } catch (error) {
    console.error("Error updating account:", error);
    return false;
  }
}

/* ***************************
 *  Update user password
 * ************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE accounts 
      SET password = $1 
      WHERE account_id = $2 RETURNING *;
    `;
    await db.query(sql, [hashedPassword, account_id]);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
}

module.exports = { getAccountByEmail, updateAccount, updatePassword };
