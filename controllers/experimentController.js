const { validationResult } = require("express-validator")
const db = require("../models/experiment/queries.js")


async function experimentGet(req, res) {
  const sectionId = req.params.sectionId
  const experimentId = req.params.experimentId
  const userId = req.user.id
  const user = req.user

  try {
    console.log("Getting experiment for user")
    const experimentId = req.params.experimentId
    console.log("Getting experiment id", experimentId)


    const experimentInfo = await db.getExperimentInfo(experimentId)
    console.log("Retrieved experiment info: ", experimentInfo)

    console.log(user)
    let instructions;
    let components;
    if (user) {
      instructions = await db.getExperimentInstructions(experimentId, userId);
      console.log("Retrieved experiment instructions: ", instructions);

      components = await db.getExperimentComponents(experimentId, userId)
      console.log("Retrieved experiment components: ", components)
    } else {
      // instructions = await db.getPublicExperimentInstructions(experimentId);
      // console.log("Retrieved experiment instructions: ", instructions);

      components = await db.getPublicExperimentComponents(experimentId)
      console.log("Retrieved experiment components: ", components)
    }

    const observation = await db.getExperimentObservation(experimentId, userId);
    console.log("Retrieved experiment observation: ", observation);


    res.render("experiment/experiment", { title: "Experiment", experimentInfo, instructions, components, observation, sectionId, experimentId, user })
  } catch (err) {
    console.error("Unable to get render experiment", err)
  }
}

async function experimentCreateGet(req, res) {
  const sectionId = req.params.sectionId

  console.log("going to create experiment page...")
  res.render("experiment/createExperiment", {
    title: "Create Experiment", sectionId
  })
}

async function experimentCreatePost(req, res) {

  const { experimentName, description } = req.body
  const isPublic = req.body.isPublic === 'true'
  const sectionId = req.params.sectionId
  const userId = req.user.id

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log("Validation errors: ", errors.array())
    return res.status(400).render("experiment/createExperiment", {
      title: "Create Experiment",
      sectionId,
      errors: errors.array(),
      experimentName,
      description
    })
  }

  try {
    console.log(`Adding experiment with name: ${experimentName} description: ${description} to section with sectionId of ${sectionId}`)

    await db.addExperiment(sectionId, experimentName, description, userId, isPublic)
    res.redirect(`/my/sections/${sectionId}/experiments`)
  } catch (err) {
    console.error("Unable to add experiment to section with id: ", sectionId, err)
  }
}

async function experimentDelete(req, res) {
  const experimentId = req.params.experimentId
  const sectionId = req.params.sectionId
  const userId = req.user.id

  console.log(`deleting experiment from ${req.user} db...`)
  await db.deleteExperiment(experimentId, userId)
  res.redirect(`/my/sections/${sectionId}/experiments`)
}

async function experimentCreateInstructionPost(req, res) {

  const { instruction_markdown } = req.body
  const experimentId = req.params.experimentId
  const sectionId = req.params.sectionId
  const userId = req.user.id

  try {
    console.log("Adding instructions to experiment...")

    console.log(instruction_markdown)

    await db.addInstruction(experimentId, userId, instruction_markdown)
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`)
  } catch (err) {
    console.error("Controller was unable to add markdown instructions to db", err)
  }
}

async function experimentUpdateInstructionPost(req, res) {

  const { instId, sectionId, experimentId } = req.params
  const { instruction_markdown } = req.body
  console.log(instruction_markdown)
  const userId = req.user.id

  try {
    console.log(`Updating ${req.user.username} instructions post...`)

    await db.updateInstruction(instId, userId, instruction_markdown)

    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Controller was unable to update instructions")
  }
}


async function experimentCreateObservationPost(req, res) {

  const { observation_markdown } = req.body
  const experimentId = req.params.experimentId
  const sectionId = req.params.sectionId
  const userId = req.user.id

  try {
    console.log("Adding observation to experiment...")

    await db.addObservation(experimentId, userId, observation_markdown)
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`)
  } catch (err) {
    console.error("Controller was unable to add markdown obseration to db")
  }
}

async function experimentUpdateObservationPost(req, res) {

  const { obsId, sectionId, experimentId } = req.params
  const { observation_markdown } = req.body
  console.log(observation_markdown)
  const userId = req.user.id

  try {
    console.log(`Updating ${req.user.username} observation post...`)

    await db.updateObservation(obsId, userId, observation_markdown)

    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Controller was unable to update observation")
  }
}

async function experimentCreateComponentGet(req, res) {
  const sectionId = req.params.sectionId
  const experimentId = req.params.experimentId

  console.log("going to create component page...")
  res.render("experiment/createComponent", {
    title: "Create Component", sectionId, experimentId
  })
}

async function experimentCreateComponentPost(req, res) {
  const { name, component_description, buy_link, datasheet_link } = req.body;
  const { experimentId, sectionId } = req.params;
  const userId = req.user.id;

  try {
    await db.addComponent(experimentId, name, component_description, buy_link, datasheet_link, userId);
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error creating component:", err);
    res.status(500).send("Error creating component");
  }
}

async function experimentEditComponentGet(req, res) {
  const { sectionId, experimentId, componentId } = req.params;
  const userId = req.user.id;

  try {
    const component = await db.getComponentById(experimentId, userId);

    if (!component) {
      return res.status(404).send("Component not found");
    }

    res.render("experiment/editComponent", {
      sectionId,
      experimentId,
      component,
    });
  } catch (err) {
    console.error("Error fetching component:", err);
    res.status(500).send("Error loading edit page");
  }
}

async function experimentEditComponentPost(req, res) {
  const { name, component_description, buy_link, datasheet_link } = req.body;
  const { componentId, experimentId, sectionId } = req.params;
  const userId = req.user.id;

  try {
    await db.updateComponent(componentId, userId, name, component_description, buy_link, datasheet_link);
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error updating component:", err);
    res.status(500).send("Error updating component");
  }
}

async function experimentDeleteComponentPost(req, res) {
  const { componentId, experimentId, sectionId } = req.params;

  try {
    await db.deleteComponent(componentId, experimentId);
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error deleting component:", err);
    res.status(500).send("Error deleting component");
  }
}


module.exports = {
  experimentGet,
  experimentCreateGet,
  experimentCreatePost,
  experimentDelete,
  experimentCreateObservationPost,
  experimentUpdateObservationPost,
  experimentCreateInstructionPost,
  experimentUpdateInstructionPost,
  experimentCreateComponentGet,
  experimentCreateComponentPost,
  experimentEditComponentGet,
  experimentEditComponentPost,
  experimentDeleteComponentPost

}
