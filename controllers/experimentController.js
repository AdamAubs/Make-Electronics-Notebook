const { validationResult } = require("express-validator")
const db = require("../models/experiment/queries.js")


async function experimentGet(req, res) {

  try {
    console.log("Getting experiment for user")
    const experimentId = req.params.experimentId
    console.log("Getting experiment id", experimentId)


    const experimentInfo = await db.getExperimentInfo(experimentId)
    console.log("Retrieved experiment info: ", experimentInfo)


    const instructions = await db.getExperimentInstructions(experimentId)
    console.log("Retrieved experiment instructions: ", instructions)


    const components = await db.getExperimentComponents(experimentId)
    console.log("Retrieved experiment components: ", components)

    res.render("experiment/experiment", { title: "Experiment", experimentInfo, instructions, components })
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

module.exports = {
  experimentGet,
  experimentCreateGet,
  experimentCreatePost,
  experimentDelete
}
