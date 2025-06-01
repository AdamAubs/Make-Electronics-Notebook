
const db = require("../models/index/queries.js")


async function sectionsListGet(req, res) {
  try {
    const publicSections = await db.getPublicSections();

    if (req.isAuthenticated()) {
      const userId = req.user.id;
      //console.log("Getting sections created by user with userId: ", userId)
      const privateSections = await db.getPrivateSections(userId);

      // console.log("Retrieved private sections:", privateSections);
      return res.render("index", {
        title: "Make Electronics Guide",
        user: req.user,
        publicSections,
        privateSections,
        flashErrorMessages: req.flash('error'),
        flashSuccessMessages: req.flash('success')
      });
    }

    //console.log("Retrieved public sections:", publicSections);
    res.render("index", {
      title: "Make Electronics Guide",
      user: null,
      publicSections,
      privateSections: null,
      flashErrorMessages: req.flash('error'),
      flashSuccessMessages: req.flash('success')
    });

  } catch (err) {
    console.error("Unable to render sections", err);
    req.flash("error", "Unable to render sections");
    res.redirect("/")
  }
}

module.exports = {
  sectionsListGet
}
