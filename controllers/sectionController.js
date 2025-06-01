const db = require("../models/sections/queries.js")


async function experimentsListGet(req, res) {
  try {
    const sectionId = req.params.sectionId
    const publicExperiments = await db.getPublicExperiments(sectionId);

    if (req.isAuthenticated()) {
      const userId = req.user.id;

      console.log("Getting experiment created by user with userId: ", userId)
      const privateExperiments = await db.getPrivateExperiments(sectionId, userId);

      const flashErrorMessages = req.flash("error");
      const flashSuccessMessages = req.flash("success");

      console.log("Retrieved private experiments:", privateExperiments);
      return res.render("sections/sections", {
        title: "Experiment List",
        user: req.user,
        sectionId,
        publicExperiments,
        privateExperiments,
        flashErrorMessages,
        flashSuccessMessages
      });
    }

    res.render("sections/sections", {
      title: "Experiment List",
      user: null,
      sectionId,
      publicExperiments,
      privateExperiments: null,
      flashErrorMessages: [],
      flashSuccessMessages: []
    });

  } catch (err) {
    console.error("Unable to render experiments", err);
    res.status(500).send("Internal Server Error");
  }
}

// TODO:: Possibly include feature to allow user to add person sections
//        not related to the book.
//
// async function sectionCreateGet(req, res) {
//   res.render("sections/createSection", {
//     title: "Create section"
//   })
// }
//
// async function sectionCreatePost(req, res) {
//   const { sectionName, description } = req.body
//   const isPublic = req.body.isPublic === 'true'
//   const userId = req.user.id
//
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     console.log("Validation errors: ", errors.array())
//     return res.status(400).render("sections/createSection", {
//       title: "Create Section",
//       errors: errors.array(),
//       sectionName,
//       description,
//       flashErrorMessages: [],
//       flashSuccessMessages: []
//     })
//   }
//
//   console.log(`Adding ${sectionName} with a description of ${description} to the db`)
//   await db.addSection(sectionName, description, userId, isPublic)
//   res.redirect("/")
// }

module.exports = {
  experimentsListGet,
}
