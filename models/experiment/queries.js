const pool = require("../../db/pool.js")

async function addExperiment(sectionId, experimentName, description, userId, isPublic) {
  try {
    await pool.query("INSERT INTO experiment (title, description, section_id, created_by_user_id, is_public) VALUES ($1, $2, $3, $4, $5)", [experimentName, description, sectionId, userId, isPublic])
    console.log(`Added experiment ${experimentName} to the db`)
  } catch (err) {
    console.error(`Error adding ${experimentName} to the db. Error messaage: ${err}`)
  }
}

async function getExperimentByNameAndSection(userInput, sectionId) {
  try {
    const result = await pool.query("SELECT * FROM experiment WHERE title = ($1) AND section_id = ($2)", [userInput, sectionId])
    return result.rows[0]
  } catch (err) {
    console.error("Error")
  }
}


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

async function getExperimentObservation(experimentId, userId) {
  try {
    const SQL = `
                SELECT * 
                FROM observation AS o
                WHERE o.experiment_id = $1 AND user_id = $2
                LIMIT 1;
    `
    const result = await pool.query(SQL, [experimentId, userId])
    // console.log(rows)
    return result.rows[0]
  } catch (err) {
    console.error("Error fetching observation from db", err)
    return []
  }

}

async function deleteExperiment(experimentId, userId) {
  try {
    await pool.query("DELETE FROM experiment WHERE id = ($1) AND created_by_user_id = ($2)", [experimentId, userId])
  } catch (err) {
    console.error("Error deleting experiment from db", err)
  }
}

async function addObservation(experimentId, userId, observation_markdown) {
  try {
    await pool.query(
      `INSERT INTO observation (experiment_id, user_id, type, data)
       VALUES ($1, $2, 'markdown', $3)`,
      [experimentId, userId, observation_markdown]
    )
  } catch (err) {
    console.error("Unable to add markdown observation to db")
  }
}

async function updateObservation(obsId, userId, observation_markdown) {
  try {
    const SQL = `
                UPDATE observation
                SET data = $1
                WHERE id = $2 AND user_id = $3;
    `

    await pool.query(SQL, [observation_markdown, obsId, userId])
  } catch (err) {
    console.error("Unable to add markdown observation to db")
  }
}




module.exports = {
  addExperiment,
  getExperimentByNameAndSection,
  getExperimentInfo,
  getExperimentInstructions,
  getExperimentComponents,
  deleteExperiment,
  addObservation,
  updateObservation,
  getExperimentObservation
}
