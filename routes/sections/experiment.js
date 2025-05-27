const { Router } = require("express")
const { ensureAuthenticated } = require("../../validators/auth.js")
const { createExperimentValidator } = require("../../validators/experiment.js")
const experimentController = require("../../controllers/experimentController.js")
const experimentRouter = Router()

experimentRouter.get("/:sectionId/experiments/createExperiment", ensureAuthenticated, experimentController.experimentCreateGet)
experimentRouter.post("/:sectionId/experiments/createExperiment", ensureAuthenticated, createExperimentValidator, experimentController.experimentCreatePost)
experimentRouter.post("/:sectionId/experiments/:experimentId/delete", ensureAuthenticated, experimentController.experimentDelete)
experimentRouter.get("/:sectionId/experiments/:experimentId", ensureAuthenticated, experimentController.experimentGet)

module.exports = experimentRouter
