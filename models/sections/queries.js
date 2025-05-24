const pool = require("../../db/pool.js")

async function getAllExperiments(sectionId) {
  try {
    const { rows } = await pool.query("SELECT * FROM experiment WHERE section_id = ($1)", [sectionId])
    console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching sections from db", err)
    return []
  }
}

async function addSection(sectionName, description) {
  try {
    await pool.query("INSERT INTO section (title, description) VALUES ($1, $2)", [sectionName, description])
    console.log(`Added ${sectionName} section to the db`)
  } catch (err) {
    console.error(`Error adding ${sectionName} to the db. Error messaage: ${err}`)
  }
}

module.exports = {
  getAllExperiments,
  addSection
}
