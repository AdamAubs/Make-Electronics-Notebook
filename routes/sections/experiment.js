const { Router } = require("express")
const experimentController = require("../../controllers/experimentController.js")
const experimentRouter = Router()

experimentRouter.get("/:sectionId/experiments/:experimentId", experimentController.experimentGet)
module.exports = experimentRouter
