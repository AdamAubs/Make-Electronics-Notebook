const { Router } = require("express")
const aboutRouter = Router();

aboutRouter.get("/", (req, res) => {
  try {
    res.render("about", { title: "About page" })
  } catch (err) {
    res.flash('error', "Unable to load about page")
    res.redirect("/")
  }
})

module.exports = aboutRouter 
