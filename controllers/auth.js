//Authentication Controller

const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  //generate a token for the user for user's entrance into the application
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  //validation check
  if (!email || !password) {
    throw new BadRequestError("Please provide valid email and/or password")
  }

  //database search for user
  const user = await User.findOne({ email })

  //error message for unauthenticated users
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  //compare password
  const isPasswordCorrect = await user.checkHashedPassword(password)

  //error message for incorrect passwords
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  //generate a token for the user's duration into the system
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }
