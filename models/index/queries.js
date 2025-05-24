const pool = require("../../db/pool.js")

async function getAllSections() {
  try {
    const { rows } = await pool.query("SELECT * FROM section")
    console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching sections from db", err)
    return []
  }
}

module.exports = {
  getAllSections,
}
