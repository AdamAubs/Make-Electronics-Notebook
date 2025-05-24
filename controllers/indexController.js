
const db = require("../models/index/queries.js")

async function sectionsListGet(req, res) {

  try {
    console.log("Getting sections for user")
    const sections = await db.getAllSections()
    // console.log("Sections retrieved from db: ", sections.map((e) => { title: e.title }))
    console.log("Retrieved sections: ", sections)
    res.render("index", { title: "Make Electronics Guide", sections, })
  } catch (err) {
    console.error("Unable to get render sections", err)
  }
}

module.exports = {
  sectionsListGet,
}
