
const db = require("../models/experiment/queries.js")

async function experimentGet(req, res) {

  const sectionId = req.params.sectionId
  const experimentId = req.params.experimentId
  const user = null

  //console.log(sectionId)

  try {
    //console.log("Getting experiment for user")
    const experimentId = req.params.experimentId
    //console.log("Getting experiment id", experimentId)

    const experimentInfo = await db.getExperimentInfo(experimentId)
    //console.log("Retrieved experiment info: ", experimentInfo)

    const instructions = await db.getExperimentInstructions(experimentId)
    //console.log("Retrieved experiment instructions: ", instructions)

    const components = await db.getExperimentComponents(experimentId)
    //console.log("Retrieved experiment components: ", components)

    res.render("experiment/experiment", { title: "Experiment", experimentInfo, instructions, components, sectionId, experimentId, user, flashErrorMessages: [], flashSuccessMessages: [] })
  } catch (err) {
    console.error("Unable to get render experiment", err)
  }
}

module.exports = { experimentGet }
