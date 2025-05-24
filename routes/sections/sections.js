const { Router } = require("express")
const sectionsController = require("../../controllers/sectionController.js")
const sectionRouter = Router()

sectionRouter.get("/:sectionId/experiments", sectionsController.experimentsListGet)
sectionRouter.get("/createSection", sectionsController.sectionCreateGet)
sectionRouter.post("/createSection", sectionsController.sectionCreatePost)

module.exports = sectionRouter
