const express = require("express")
const path = require("path")
const app = express()
const port = process.env.port || 3000
const UAParser = require("ua-parser-js")

/* parcel bundler */
const Bundler = require("parcel-bundler")
if (process.env.NODE_ENV !== "production") {
  const file = ["app/index.ts", "styles/index.scss"]
  const options = {
    outDir: "./public",
    production: process.argv[2] === "build" ? true : false,
  }
  const bundler = new Bundler(file, options)
  app.use(bundler.middleware())
}

/* ua-parser */
const ua = function (req, res, next) {
  const ua = UAParser(req.headers["user-agent"])
  res.locals.isPhone = ua.device.type === "mobile"
  res.locals.isTablet = ua.device.type === "tablet"
  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isDev = process.env.NODE_ENV !== "production"
  next()
}

app.use(express.static(path.join(__dirname, "public")))
app.use(ua)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

const titles = {
  home: "New WEbsite",
}

app.get("/", async (req, res) => {
  res.render("pages/home", {
    title: titles["home"],
  })
})

app.get("*", async (req, res) => {
  res.redirect("/")
})

app.listen(port, () => {
  console.log(
    `\x1b[32m Server listening at\x1b[0m`,
    `\x1b[4mhttp://localhost:${port}\x1b[0m`
  )
})

module.exports = app
