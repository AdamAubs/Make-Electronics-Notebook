const { body } = require('express-validator')
const db = require("../models/sections/queries.js")


const createSectionValidator = [
  body('sectionName')
    .trim()
    .notEmpty().withMessage('Section name is required')
    .isLength({ max: 255 }).withMessage('Section name must be under 255 characters')
    .custom(async (value) => {
      const exitstingSection = await db.getSectionByName(value)
      if (exitstingSection) {
        console.log("Section already exists: ", exitstingSection)
        throw Error('Section name already exists')
      }
      return true;
    }),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
]

module.exports = {
  createSectionValidator
}
