
const db = require("../models/sections/queries.js")

async function experimentsListGet(req, res) {

  try {
    console.log("Getting experiments for user")
    const sectionId = req.params.sectionId
    console.log(sectionId)
    const experiments = await db.getAllExperiments(sectionId)
    // console.log("Sections retrieved from db: ", sections.map((e) => { title: e.title }))
    console.log("Retrieved experiments: ", experiments)
    res.render("sections/sections", { title: "Experiment list", experiments, })
  } catch (err) {
    console.error("Unable to get render experiment list", err)
  }
}

async function sectionCreateGet(req, res) {
  res.render("sections/createSection", {
    title: "Create section"
  })
}

async function sectionCreatePost(req, res) {
  const { sectionName, description } = req.body
  console.log(`Adding ${sectionName} with a description of ${description} to the db`)
  await db.addSection(sectionName, description)
  res.redirect("/")
}

module.exports = {
  experimentsListGet,
  sectionCreateGet,
  sectionCreatePost
}
