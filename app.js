
const express = require("express")
const app = express();
const path = require("node:path")

require("dotenv").config()
const session = require("express-session")
const flash = require('connect-flash');
const passport = require("passport")
const initializePassport = require("./config/passportConfig")
initializePassport(passport)

const indexRouter = require("./routes/index.js")
const usersRouter = require("./routes/users.js")
const aboutRouter = require("./routes/about.js")
const sectionsIndexRouter = require("./routes/sections/sections.js")
const experimentsRouter = require("./routes/sections/experiment.js");
const publicSectionRouter = require("./routes/sections/publicSections.js");
const publicExperimentsRouter = require("./routes/sections/publicExperiment.js")

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

app.use("/", indexRouter)
app.use("/", usersRouter)
app.use("/about", aboutRouter)
app.use("/sections/", publicSectionRouter)
app.use("/sections/", publicExperimentsRouter)
app.use("/my/sections/", sectionsIndexRouter)
app.use("/my/sections/", experimentsRouter)

app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Makeelectronics app listening on port ${PORT}`))
