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

async function addSection(sectionName, description, userId) {
  try {
    await pool.query(
      "INSERT INTO section (title, description, created_by_user_id, is_public) VALUES ($1, $2, $3, $4)",
      [sectionName, description, userId, false]
    );
    console.log(`Added ${sectionName} section for user ${userId}`);
  } catch (err) {
    console.error(`Error adding ${sectionName} for user ${userId}: ${err}`);
  }
}

async function getSectionByName(userInput) {
  try {
    const result = await pool.query("SELECT * FROM section WHERE title = ($1)", [userInput])
    return result.rows[0]
  } catch (err) {
    console.error(`Error`)
  }
}


module.exports = {
  getAllExperiments,
  addSection,
  getSectionByName
}
