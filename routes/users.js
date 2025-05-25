
const { Router } = require("express")
const userController = require("../controllers/userController.js")
const userRouter = Router();
const passport = require("passport")


userRouter.get("/signup", userController.signupFormGet)
userRouter.post("/signup", userController.signupFormPost)
userRouter.get("/login", userController.loginFormGet)
userRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false
})
)
userRouter.get("/logout", userController.logoutFormGet)

module.exports = userRouter
