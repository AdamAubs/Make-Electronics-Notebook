const { Router } = require("express")
const { ensureAuthenticated } = require("../../validators/auth.js")
const { createExperimentValidator } = require("../../validators/experiment.js")
const experimentController = require("../../controllers/experimentController.js")
const experimentRouter = Router()


experimentRouter.get("/:sectionId/experiments/:experimentId/createComponent", ensureAuthenticated, experimentController.experimentCreateComponentGet);
experimentRouter.post("/:sectionId/experiments/:experimentId/createComponent", ensureAuthenticated, experimentController.experimentCreateComponentPost);


experimentRouter.get("/:sectionId/experiments/:experimentId/editComponent/:componentId", ensureAuthenticated, experimentController.experimentEditComponentGet);
experimentRouter.post("/:sectionId/experiments/:experimentId/editComponent/:componentId", ensureAuthenticated, experimentController.experimentEditComponentPost);

experimentRouter.post("/:sectionId/experiments/:experimentId/deleteComponent/:componentId", ensureAuthenticated, experimentController.experimentDeleteComponentPost);

experimentRouter.post("/:sectionId/experiments/:experimentId/createInstruction", ensureAuthenticated, experimentController.experimentCreateInstructionPost)
experimentRouter.post("/:sectionId/experiments/:experimentId/editInstruction/:instId", ensureAuthenticated, experimentController.experimentUpdateInstructionPost)
experimentRouter.post("/:sectionId/experiments/:experimentId/createObservation", ensureAuthenticated, experimentController.experimentCreateObservationPost)
experimentRouter.post("/:sectionId/experiments/:experimentId/editObservation/:obsId", ensureAuthenticated, experimentController.experimentUpdateObservationPost)
experimentRouter.get("/:sectionId/experiments/createExperiment", ensureAuthenticated, experimentController.experimentCreateGet)
experimentRouter.post("/:sectionId/experiments/createExperiment", ensureAuthenticated, createExperimentValidator, experimentController.experimentCreatePost)
experimentRouter.post("/:sectionId/experiments/:experimentId/delete", ensureAuthenticated, experimentController.experimentDelete)
experimentRouter.get("/:sectionId/experiments/:experimentId", ensureAuthenticated, experimentController.experimentGet)

module.exports = experimentRouter
