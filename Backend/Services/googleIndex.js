import { google } from 'googleapis'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.resolve(__dirname, "..", "service-account.json")

export let googleIndexer = async (url) => {
    let auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/indexing']
    })

    let client = await auth.getClient()
    let indexing = google.indexing({
        version: "v3",
        auth: client
    })

    let response = await indexing.urlNotifications.publish({
        requestBody: {
            url: url,
            type: "URL_UPDATED"
        }
    })

    return response?.data ?? null
}
