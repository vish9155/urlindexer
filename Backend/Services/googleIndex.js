import { google } from 'googleapis'

export let googleIndexer = async (url) => {
    try {
        let auth = new google.auth.GoogleAuth({
            keyFile: 'service-account.json',
            scopes: ['https://www.googleapis.com/auth/indexing']
        })

        let client = await auth.getClient()
        let indexing = google.indexing({
            version: "v3",
            auth: client
        })
        await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: "URL_UPDATED"
            }
        })
    }
    catch (error) {
        console.log("Error in Google Indexing api", error.message)
    }
}
