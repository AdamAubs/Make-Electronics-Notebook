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

const createComponentValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Component name is required')
    .isLength({ max: 255 }).withMessage('Component name must be under 255 characters'),

  body('component_description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description must be under 1000 characters'),

  body('buy_link')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Buy link must be a valid URL'),

  body('data_sheet_link')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Datasheet link must be a valid URL')
];


const instructionMarkdownValidator = [
  body("instruction_markdown")
    .trim()
    .notEmpty()
    .withMessage("Instruction content cannot be empty.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Instruction is too short — add more details.")
    .isLength({ max: 10000 })
    .withMessage("Instruction is too long — keep it under 10,000 characters.")
];

const observationMarkdownValidator = [
  body("observation_markdown")
    .trim()
    .notEmpty()
    .withMessage("Observation content cannot be empty.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Observation is too short — add more details.")
    .isLength({ max: 10000 })
    .withMessage("Observation is too long — keep it under 10,000 characters.")
];

module.exports = {
  createExperimentValidator,
  createComponentValidator,
  instructionMarkdownValidator,
  observationMarkdownValidator
};
