const { Router } = require("express")
const publicSectionController = require("../../controllers/publicSectionController.js")

const publicSectionRouter = Router()

publicSectionRouter.get("/:sectionId/experiments", publicSectionController.experimentsListGet)

module.exports = publicSectionRouter
