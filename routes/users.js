
const { Router } = require("express")
const userController = require("../controllers/userController.js")
const { loginValidator, signupValidator } = require('../validators/authValidators.js')
const { validationResult } = require('express-validator');
const userRouter = Router();
const passport = require("passport")
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login requests per window
  message: "Too many login attempts from this IP, please try again later."
});

userRouter.get("/signup", userController.signupFormGet)
userRouter.post("/signup", signupValidator, userController.signupFormPost)
userRouter.get("/login", userController.loginFormGet)
userRouter.post("/login", loginLimiter, loginValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('users/login', {
      errors: errors.array(),
      flashErrorMessages: [],
      flashSuccessMessages: []
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message || "Invalid credentials");
      return res.redirect("/login");
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) return next(err);

      req.flash("success", "Successfully logged in!");
      return res.redirect("/");
    });
  })(req, res, next);
});
userRouter.get("/logout", userController.logoutFormGet)

module.exports = userRouter
