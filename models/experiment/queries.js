const pool = require("../../db/pool.js")

async function getExperimentInfo(experimentId) {
  try {
    const SQL = `
                SELECT
                  e.id AS experiment_id,
                  e.title AS experiment_title,
                  e.description AS experiment_description
                FROM experiment e
                WHERE e.id = ($1) 
    `
    const { rows } = await pool.query(SQL, [experimentId])
    // console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching experiment from db", err)
    return []
  }
}

async function getExperimentInstructions(experimentId) {
  try {
    const SQL = `
                SELECT
                  i.step_number,
                  i.text AS instruction_text
                FROM instruction i
                WHERE i.experiment_id = ($1) 
                ORDER BY i.step_number;
    `
    const { rows } = await pool.query(SQL, [experimentId])
    // console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching instruction from db", err)
    return []
  }
}

async function getExperimentComponents(experimentId) {
  try {
    const SQL = `
                SELECT
                  c.name,
                  c.description AS component_description,
                  c.buy_link
                FROM component AS c
                JOIN experiment_component AS ec ON (c.id = ec.component_id)
                WHERE ec.experiment_id = ($1);
    `

    const { rows } = await pool.query(SQL, [experimentId])
    // console.log(rows)
    return rows
  } catch (err) {
    console.error("Error fetching components from db", err)
    return []
  }
}

module.exports = {
  getExperimentInfo,
  getExperimentInstructions,
  getExperimentComponents,
}
