const pool = require("../../db/pool.js")

async function getPublicSections() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM section
    `)
    console.log(rows[0])
    return rows
  } catch (err) {
    console.error("Error fetching sections from db", err)
    return []
  }
}

async function getPrivateSections(userId) {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM section WHERE created_by_user_id = ($1)
    `, [userId])
    console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching sections from db", err)
    return []
  }
}

module.exports = {
  getPublicSections,
  getPrivateSections
}
