const { validationResult } = require("express-validator")
const db = require("../models/experiment/queries.js")

async function experimentGet(req, res) {
  const sectionId = req.params.sectionId
  const experimentId = req.params.experimentId
  const userId = req.user.id
  const user = req.user

  const flashErrorMessages = req.flash("error");
  const flashSuccessMessages = req.flash("success");


  try {
    console.log("Getting experiment for user")
    const experimentId = req.params.experimentId
    console.log("Getting experiment id", experimentId)

    const experimentInfo = await db.getExperimentInfo(experimentId)
    console.log("Retrieved experiment info: ", experimentInfo)

    const instructions = await db.getExperimentInstructions(experimentId, userId);
    console.log("Retrieved experiment instructions: ", instructions);

    const components = await db.getExperimentComponents(experimentId, userId)
    console.log("Retrieved experiment components: ", components)

    const observation = await db.getExperimentObservation(experimentId, userId);
    console.log("Retrieved experiment observation: ", observation);

    res.render("experiment/experiment", {
      title: "Experiment",
      experimentInfo, instructions,
      components,
      observation,
      sectionId,
      experimentId,
      user,
      flashErrorMessages,
      flashSuccessMessages
    })
  } catch (err) {
    console.error("Unable to get render experiment", err)
    req.flash("error", "Something went wrong loading the experiment.");
    res.redirect(`/my/sections/${sectionId}/experiments`);
  }
}

async function experimentCreateGet(req, res) {
  try {
    const sectionId = req.params.sectionId;

    console.log("going to create experiment page...");
    res.render("experiment/createExperiment", {
      title: "Create Experiment",
      sectionId,
      flashErrorMessages: [],
      flashSuccessMessages: []
    });
  } catch (err) {
    console.error("Error rendering experiment creation page:", err);
    req.flash("error", "Something went wrong loading the Create Experiment page.");
    res.redirect(`/my/sections/${sectionId}/experiments`)
  }
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
      description,
      flashErrorMessages: [],
      flashSuccessMessages: []
    })
  }

  try {
    console.log(`Adding experiment with name: ${experimentName} description: ${description} to section with sectionId of ${sectionId}`)

    await db.addExperiment(sectionId, experimentName, description, userId, isPublic)

    req.flash("success", `Successfully created experiment: ${experimentName}`)
    res.redirect(`/my/sections/${sectionId}/experiments`)
  } catch (err) {
    console.error("Unable to add experiment to section with id: ", sectionId, err)
    req.flash("error", "Something went wrong creating the experiment.");
    res.redirect(`/my/sections/${sectionId}/experiments`)
  }
}

async function experimentDelete(req, res) {
  const experimentId = req.params.experimentId;
  const sectionId = req.params.sectionId;
  const userId = req.user.id;

  try {
    console.log(`deleting experiment from ${req.user.username}'s db...`);
    await db.deleteExperiment(experimentId, userId);

    req.flash("success", "Experiment deleted successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments`);
  } catch (err) {
    console.error("Error deleting experiment:", err);

    req.flash("error", "Failed to delete experiment. Please try again.");
    res.redirect(`/my/sections/${sectionId}/experiments`);
  }
}

async function experimentCreateInstructionPost(req, res) {
  const { instruction_markdown } = req.body
  const experimentId = req.params.experimentId
  const sectionId = req.params.sectionId
  const userId = req.user.id

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }

  try {
    console.log("Adding instructions to experiment...")

    await db.addInstruction(experimentId, userId, instruction_markdown)

    req.flash("success", "Instruction successfully added.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`)
  } catch (err) {
    console.error("Controller was unable to add markdown instructions to db", err)
    req.flash("error", "Failed to add instruction.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`)

  }
}

async function experimentUpdateInstructionPost(req, res) {
  const { instId, sectionId, experimentId } = req.params;
  const { instruction_markdown } = req.body;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }

  try {
    console.log(`Updating ${req.user.username}'s instruction...`);
    await db.updateInstruction(instId, userId, instruction_markdown);

    req.flash("success", "Instruction updated successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Controller was unable to update instructions:", err);

    req.flash("error", "Something went wrong while updating the instruction.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}

async function experimentCreateObservationPost(req, res) {
  const { observation_markdown } = req.body;
  const experimentId = req.params.experimentId;
  const sectionId = req.params.sectionId;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }

  try {
    console.log("Adding observation to experiment...");

    await db.addObservation(experimentId, userId, observation_markdown);

    req.flash("success", "Observation added successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Controller was unable to add markdown observation to DB:", err);

    req.flash("error", "Something went wrong while adding the observation.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}


async function experimentUpdateObservationPost(req, res) {

  const { obsId, sectionId, experimentId } = req.params
  const { observation_markdown } = req.body
  const userId = req.user.id

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }

  try {
    console.log(`Updating ${req.user.username} observation post...`)

    await db.updateObservation(obsId, userId, observation_markdown)

    req.flash("success", "Oberservation updated successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Controller was unable to update observation")

    req.flash("error", "Something went wrong while updating the observation.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}


async function experimentCreateComponentGet(req, res) {
  const sectionId = req.params.sectionId;
  const experimentId = req.params.experimentId;

  try {
    console.log("Going to create component page...");

    res.render("experiment/createComponent", {
      title: "Create Component",
      sectionId,
      experimentId,
      flashErrorMessages: req.flash("error"),
      flashSuccessMessages: req.flash("success")
    });
  } catch (err) {
    console.error("Failed to render create component page:", err);
    req.flash("error", "Something went wrong while loading the component creation page.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}


async function experimentCreateComponentPost(req, res) {
  const { name, component_description, buy_link, datasheet_link } = req.body;
  const { experimentId, sectionId } = req.params;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}/${componentId}`);
  }

  try {
    await db.addComponent(experimentId, name, component_description, buy_link, datasheet_link, userId);

    req.flash("success", "Component created successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error creating component:", err);
    req.flash("error", "Something went wrong creating the component.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}

async function experimentEditComponentGet(req, res) {
  const { sectionId, experimentId, componentId } = req.params;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}/editComponent/${componentId}`);
  }

  try {
    const component = await db.getComponentById(experimentId, userId);

    if (!component) {
      req.flash("error", "Component not found in database.");
      return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
    }

    res.render("experiment/editComponent", {
      sectionId,
      experimentId,
      component,
      flashErrorMessages: req.flash("error"),
      flashSuccessMessages: req.flash("success"),
    });
  } catch (err) {
    console.error("Error fetching component:", err);
    req.flash("error", "Failed to load the edit component page.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}

async function experimentEditComponentPost(req, res) {
  const { name, component_description, buy_link, datasheet_link } = req.body;
  const { componentId, experimentId, sectionId } = req.params;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" "));
    return res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}/editComponent/${componentId}`)
  }

  try {
    await db.updateComponent(componentId, userId, name, component_description, buy_link, datasheet_link);

    req.flash("success", "Component updated successfully.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error updating component:", err);
    req.flash("error", "Failed to update the component.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  }
}

async function experimentDeleteComponentPost(req, res) {
  const { componentId, experimentId, sectionId } = req.params;

  try {
    await db.deleteComponent(componentId, experimentId);

    req.flash("success", "Component successfully deleted.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);
  } catch (err) {
    console.error("Error deleting component:", err);
    req.flash("error", "Failed to delete the component.");
    res.redirect(`/my/sections/${sectionId}/experiments/${experimentId}`);

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
