import { google } from "googleapis"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.resolve(__dirname, "..", "service-account.json")

let auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ["https://www.googleapis.com/auth/webmasters"]
})

let client = await auth.getClient()

let searchconsole = google.searchconsole({
    version: "v1",
    auth: client
})

export let googleSearchConsole = async (url) => {

    try {

        let siteurl = new URL(url).origin + "/"

        let res = await searchconsole.urlInspection.index.inspect({
            requestBody: {
                inspectionUrl: url,
                siteUrl: siteurl
            }
        })

        let result = res?.data?.inspectionResult?.indexStatusResult

        return result || null

    } catch (error) {

        console.log("Error in Google Search Console:", error.message)

        throw error

    }

}
