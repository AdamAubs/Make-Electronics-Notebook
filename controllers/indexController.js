
const db = require("../models/index/queries.js")


async function sectionsListGet(req, res) {
  try {
    const publicSections = await db.getPublicSections();


    if (req.isAuthenticated()) {
      const userId = req.user.id;
      console.log("Getting sections created by user with userId: ", userId)
      const privateSections = await db.getPrivateSections(userId);

      console.log("Retrieved private sections:", privateSections);
      return res.render("index", {
        title: "Make Electronics Guide",
        user: req.user,
        publicSections,
        privateSections
      });
    }

    console.log("Retrieved public sections:", publicSections);
    res.render("index", {
      title: "Make Electronics Guide",
      user: null,
      publicSections,
      privateSections: null // or just omit if your template handles undefined
    });

  } catch (err) {
    console.error("Unable to render sections", err);
    res.status(500).send("Internal Server Error");
  }
}




module.exports = {
  sectionsListGet
}
