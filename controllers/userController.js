const bcrypt = require("bcrypt")
const pool = require("../db/pool.js")

async function signupFormGet(req, res) {
  res.render("users/signup", { error: null })
}

async function signupFormPost(req, res) {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10)

    const existing = await pool.query(
      "SELECT * FROM app_user WHERE email = $1 OR username = $2",
      [email, username]
    )

    if (existing.rows.length > 0) {
      return res.render("users/signup", {
        error: "Username or email already exists"
      })
    }

    await pool.query(
      `INSERT INTO app_user (username, email, password_hash)
       VALUES ($1, $2, $3)`,
      [username, email, hash]
    );

    res.redirect("/login")
  } catch (err) {
    console.error("Signup error:", err);
    res.render("users/signup", { error: "Something went wrong. Try again." });
  }
}

async function loginFormGet(req, res) {
  res.render("users/login", { error: null })
}

async function logoutFormGet(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/login")
  })
}

module.exports = {
  signupFormGet,
  signupFormPost,
  loginFormGet,
  logoutFormGet
}
