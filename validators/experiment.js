const { body } = require('express-validator')
const db = require("../models/experiment/queries.js")


const createExperimentValidator = [
  body('experimentName')
    .trim()
    .notEmpty().withMessage('Experiment name is required')
    .isLength({ max: 255 }).withMessage('Experiment name must be under 255 characters')
    .custom(async (value, { req }) => {
      const sectionId = req.params.sectionId
      const exitstingExperiment = await db.getExperimentByNameAndSection(value, sectionId)
      if (exitstingExperiment) {
        console.log("Experiment already exists: ", exitstingExperiment)
        throw Error('Experiment name already exists in this section')
      }
      return true;
    }),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
]

module.exports = {
  createExperimentValidator
}
