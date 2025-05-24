
const { Router } = require("express")
const userController = require("../controllers/userController.js")
const userRouter = Router();

userRouter.get("/", userController)

module.exports = userRouter
