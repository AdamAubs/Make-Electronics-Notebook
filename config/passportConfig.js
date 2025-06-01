const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt")
const pool = require("../db/pool")

function initialize(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query(
          "SELECT * FROM app_user WHERE username = $1",
          [username]
        )

        const user = rows[0]
        if (!user) {
          return done(null, false, { message: "Incorrect password or username" })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password or username" })
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM app_user WHERE id = $1",
        [id]
      )
      done(null, rows[0])
    } catch (err) {
      done(err)
    }
  })
}

module.exports = initialize;
