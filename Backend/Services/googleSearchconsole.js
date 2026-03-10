import { google } from "googleapis"

let auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json",
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

        return null

    }

}