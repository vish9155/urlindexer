import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import dbConect from './Config/db.js'

import urlRoutes from './Routes/urlRoutes.js'
import errormidd from './middlewares/errormiddleware.js'
import { autositemapGenerator } from './Services/autositemapGenerator.js'
import {  startStatusCron } from './Services/indexStatusCron.js'

let app = express()
app.use(express.json())

//encode the form data
app.use(express.urlencoded({ extended: true }))

//cors issue fixed
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://usrailwaybooking.com",
        "https://usrailwaybooking.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Database connection
dbConect()

startStatusCron()
app.use("/url", urlRoutes)

console.log("Sitemap Auto Generator Started")

// every 5 minutes
setInterval(async () => {

    try {

        console.log("Generating Sitemap...")

        await autositemapGenerator()

        console.log("Sitemap Generated Successfully")

    } catch (error) {

        console.log("Sitemap Error:", error.message)

    }

}, 5 * 60 * 1000)


// ____________ Global Error Middleware _________ //
app.use(errormidd)

// server setup
let port = process.env.PORT
app.listen(port, () => console.log(`http://localhost:${port}`))