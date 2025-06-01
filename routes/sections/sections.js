const { Router } = require("express")
const sectionsController = require("../../controllers/sectionController.js")
const sectionRouter = Router()

sectionRouter.get("/:sectionId/experiments", sectionsController.experimentsListGet)

// TODO:: Possibly include feature to allow user to add person sections
//        not related to the book.
//
// sectionRouter.get("/createSection", ensureAuthenticated, sectionsController.sectionCreateGet)
// sectionRouter.post("/createSection", ensureAuthenticated, createSectionValidator, sectionsController.sectionCreatePost)


module.exports = sectionRouter
