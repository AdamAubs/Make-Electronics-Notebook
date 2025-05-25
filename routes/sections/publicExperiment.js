const { Router } = require("express")
const publicExperimentController = require("../../controllers/publicExperimentController.js")

const publicExperimentRouter = Router()

publicExperimentRouter.get("/:sectionId/experiments/:experimentId", publicExperimentController.experimentGet)

module.exports = publicExperimentRouter
