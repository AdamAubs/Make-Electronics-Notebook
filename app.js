
const express = require("express")
const app = express();

require("dotenv").config()
const session = require("express-session")
const passport = require("passport")
const initializePassport = require("./config/passportConfig")
initializePassport(passport)

const indexRouter = require("./routes/index.js")
const usersRouter = require("./routes/users.js")
const sectionsIndexRouter = require("./routes/sections/sections.js")
const experimentsRouter = require("./routes/sections/experiment.js");
const publicSectionRouter = require("./routes/sections/publicSections.js");
const publicExperimentsRouter = require("./routes/sections/publicExperiment.js")

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session())

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use("/", indexRouter)
app.use("/", usersRouter)
app.use("/sections/", publicSectionRouter)
app.use("/sections/", publicExperimentsRouter)
app.use("/my/sections/", sectionsIndexRouter)
app.use("/my/sections/", experimentsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Makeelectronics app listening on port ${PORT}`))
