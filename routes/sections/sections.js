const { Router } = require("express")
const { createSectionValidator } = require("../../validators/section.js")
const { ensureAuthenticated } = require("../../validators/auth.js")
const sectionsController = require("../../controllers/sectionController.js")
const sectionRouter = Router()

sectionRouter.get("/:sectionId/experiments", sectionsController.experimentsListGet)
sectionRouter.get("/createSection", ensureAuthenticated, sectionsController.sectionCreateGet)
sectionRouter.post("/createSection", ensureAuthenticated, createSectionValidator, sectionsController.sectionCreatePost)


module.exports = sectionRouter
