const bcrypt = require("bcrypt")
const pool = require("../db/pool.js");
const { validationResult } = require("express-validator");

async function signupFormGet(req, res) {
  res.render("users/signup", {
    errors: [],
    oldInput: {},
    flashErrorMessages: [],
    flashSuccessMessages: []
  })
}

async function signupFormPost(req, res) {
  const { username, email, password } = req.body;
  const errors = validationResult(req).array();


  try {
    const existing = await pool.query(
      "SELECT * FROM app_user WHERE email = $1 OR username = $2",
      [email, username]
    )

    if (existing.rows.length > 0) {
      errors.push({
        param: "username",
        msg: "Username or email already exists",
      });
    }

    if (errors.length > 0) {
      return res.status(422).render("users/signup", {
        errors,
        oldInput: req.body,
        flashErrorMessages: [],
        flashSuccessMessages: []
      });
    }


    const hash = await bcrypt.hash(password, 10)

    await pool.query(
      `INSERT INTO app_user (username, email, password_hash)
       VALUES ($1, $2, $3)`,
      [username, email, hash]
    );

    req.flash("success", "Signup successful! Please log in.");
    res.redirect("/login")
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).render("users/signup", {
      errors: [{ msg: "Something went wrong. Try again." }],
      oldInput: req.body,
      flashErrorMessages: [],
      flashSuccessMessages: []
    });
  }
}

async function loginFormGet(req, res) {
  const flashErrorMessages = req.flash("error");
  const flashSuccessMessages = req.flash("success");
  res.render("users/login", { errors: [], flashErrorMessages, flashSuccessMessages })
}

async function logoutFormGet(req, res) {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).render("users/login", {
        errors: [{ msg: "Error logging out." }],
        flashErrorMessages: [],
        flashSuccessMessages: []
      });
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
