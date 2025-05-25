const db = require("../models/sections/queries.js")

async function experimentsListGet(req, res) {
  const sectionId = req.params.sectionId

  const experiments = await db.getAllExperiments(sectionId)
  res.render("sections/sections", { title: "Experiment List", sectionId, experiments, user: null })
}

module.exports = { experimentsListGet }
