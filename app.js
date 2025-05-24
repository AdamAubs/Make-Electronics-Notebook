
const express = require("express")
const app = express();
const indexRouter = require("./routes/index.js")
// const usersRouter = require("./routes/users.js")
const sectionsIndexRouter = require("./routes/sections/sections.js")
const experimentsRouter = require("./routes/sections/experiment.js")
// const experimentRouter = require("./routes/sections/experiment.js")

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use("/", indexRouter)
// app.use("/users", usersRouter)
app.use("/my/sections/", sectionsIndexRouter)
app.use("/my/sections/", experimentsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Makeelectronics app listening on port ${PORT}`))
