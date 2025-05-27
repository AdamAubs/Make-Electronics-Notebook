const { validationResult } = require("express-validator")
const db = require("../models/sections/queries.js")

// async function experimentsListGet(req, res) {
//
//   try {
//     console.log("Getting experiments for user")
//     const sectionId = req.params.sectionId
//     const user = req.user
//     console.log(sectionId)
//     const experiments = await db.getAllExperiments(sectionId)
//     // console.log("Sections retrieved from db: ", sections.map((e) => { title: e.title }))
//     console.log("Retrieved experiments: ", experiments)
//     res.render("sections/sections", { title: "Experiment list", sectionId, experiments, user: user })
//   } catch (err) {
//     console.error("Unable to get render experiment list", err)
//   }
// }

async function experimentsListGet(req, res) {
  try {
    const sectionId = req.params.sectionId
    const publicExperiments = await db.getPublicExperiments(sectionId);

    if (req.isAuthenticated()) {
      const userId = req.user.id;

      console.log("Getting experiment created by user with userId: ", userId)
      const privateExperiments = await db.getPrivateExperiments(sectionId, userId);

      console.log("Retrieved private experiments:", privateExperiments);
      return res.render("sections/sections", {
        title: "Experiment List",
        user: req.user,
        sectionId,
        publicExperiments,
        privateExperiments
      });
    }

    res.render("sections/sections", {
      title: "Experiment List",
      user: null,
      sectionId,
      publicExperiments,
      privateExperiments: null // or just omit if your template handles undefined
    });

  } catch (err) {
    console.error("Unable to render experiments", err);
    res.status(500).send("Internal Server Error");
  }
}

async function sectionCreateGet(req, res) {
  res.render("sections/createSection", {
    title: "Create section"
  })
}

async function sectionCreatePost(req, res) {
  const { sectionName, description } = req.body
  const isPublic = req.body.isPublic === 'true'
  const userId = req.user.id

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log("Validation errors: ", errors.array())
    return res.status(400).render("sections/createSection", {
      title: "Create Section",
      errors: errors.array(),
      sectionName,
      description
    })
  }

  console.log(`Adding ${sectionName} with a description of ${description} to the db`)
  await db.addSection(sectionName, description, userId, isPublic)
  res.redirect("/")
}

module.exports = {
  experimentsListGet,
  sectionCreateGet,
  sectionCreatePost
}
