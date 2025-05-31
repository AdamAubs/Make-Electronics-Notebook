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

async function getExperimentInstructions(experimentId, userId) {
  try {
    const SQL = `
                SELECT * 
                FROM instruction AS i
                WHERE i.experiment_id = $1 AND user_id = $2
                LIMIT 1;
    `
    const result = await pool.query(SQL, [experimentId, userId])
    console.log(result.rows[0])
    return result.rows[0]
  } catch (err) {
    console.error("Error fetching instructions from db", err)
    return []
  }
}


async function getExperimentComponents(experimentId) {
  try {
    const SQL = `
                SELECT *
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

async function addInstruction(experimentId, userId, instruction_markdown) {
  console.log(instruction_markdown)
  console.log("------------------")
  try {
    await pool.query(
      `INSERT INTO instruction (experiment_id, data, type, user_id)
       VALUES ($1, $2, 'markdown', $3)`,
      [experimentId, instruction_markdown, userId]
    )
  } catch (err) {
    console.error("Unable to add markdown instruction to db")
  }
}

async function updateInstruction(instId, userId, instruction_markdown) {
  try {
    const SQL = `
                UPDATE instruction 
                SET data = $1
                WHERE id = $2 AND user_id = $3;
    `

    await pool.query(SQL, [instruction_markdown, instId, userId])
  } catch (err) {
    console.error("Unable to add markdown instructions to db")
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

async function addComponent(experimentId, name, component_description, buy_link, datasheet_link) {
  try {
    const newComponent = await pool.query(
      `INSERT INTO component (name, description, buy_link, datasheet_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, component_description, buy_link, datasheet_link]
    );

    const componentId = newComponent.rows[0].id;

    // Associate with experiment
    await pool.query(
      `INSERT INTO experiment_component (experiment_id, component_id)
       VALUES ($1, $2)`,
      [experimentId, componentId]
    );
  } catch (err) {
    console.error(err)
  }
}

async function getComponentById(componentId) {
  try {
    const result = await pool.query(`SELECT * FROM component WHERE id = $1`, [componentId])
    return result.rows[0]
  } catch (err) {
    console.log(err)
  }
}

// TODO: Make editing components not affect alluser components list, just the user who edited it

async function updateComponent(componentId, name, component_description, buy_link, datasheet_link) {
  try {
    await pool.query(
      `UPDATE component
       SET name = $1, description = $2, buy_link = $3, datasheet_url = $4
       WHERE id = $5`,
      [name, component_description, buy_link, datasheet_link, componentId]
    );

  } catch (err) {
    console.error(err);
  }
}

async function deleteComponent(componentId, experimentId) {
  try {
    // First delete from experiment_component
    await pool.query(
      `DELETE FROM experiment_component WHERE component_id = $1 AND experiment_id = $2`,
      [componentId, experimentId]
    );

    // Optional: delete component itself if not referenced by other experiments
    const check = await pool.query(
      `SELECT COUNT(*) FROM experiment_component WHERE component_id = $1`,
      [componentId]
    );

    if (parseInt(check.rows[0].count) === 0) {
      await pool.query(`DELETE FROM component WHERE id = $1`, [componentId]);
    }

  } catch (err) {
    console.error(err);
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
  getExperimentObservation,
  addInstruction,
  updateInstruction,
  addComponent,
  updateComponent,
  deleteComponent,
  getComponentById
}
