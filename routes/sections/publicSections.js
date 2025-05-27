const { Router } = require("express")
const sectionController = require("../../controllers/sectionController.js")

const publicSectionRouter = Router()

publicSectionRouter.get("/:sectionId/experiments", sectionController.experimentsListGet)

module.exports = publicSectionRouter
