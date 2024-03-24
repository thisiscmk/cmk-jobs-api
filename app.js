require("dotenv").config()
require("express-async-errors")

// security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit") //Used to limit repeated requests to public APIs and/or endpoints such as password reset

//Swagger (give the backend API a user interface)
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const document = YAML.load("./swagger.yaml")

const express = require("express")
const app = express()

//connectDB
const connectDB = require("./db/connect")

//authentication middleware
const authenticateUser = require("./middleware/authentication")

// routers
const authRouter = require("./routes/auth")
const jobRouter = require("./routes/jobs")

// error handler
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.set("trust proxy", 1)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 //limit each IP to 100 requests per windowMs
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get("/", (req, res) => {
  res.send(`<h1>Jobs API Successfully running</h1> <a href="api-docs"> API Documentation </a>`)
})
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(document))

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)
    app.listen(port, () => console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
