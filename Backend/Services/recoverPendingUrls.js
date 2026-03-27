import urls from "../Model/Url.js"
import { enqueueUrlJob } from "./enqueueUrlJob.js"

export const recoverPendingUrls = async () => {
    let recoverable = await urls.find({
        status: { $in: ["pending", "processing"] }
    }).limit(200)

    if (!recoverable.length) {
        console.log("Recovery scan: no pending urls to requeue")
        return
    }

    console.log(`Recovery scan: found ${recoverable.length} urls to requeue`)

    for (let record of recoverable) {
        try {
            await enqueueUrlJob(record)
            await urls.findByIdAndUpdate(record._id, {
                status: "pending",
                lastError: null
            })
            console.log("Requeued pending url:", record.url)
        } catch (error) {
            console.log("Recovery failed for:", record.url, error.message)
            await urls.findByIdAndUpdate(record._id, {
                lastError: `Recovery failed: ${error.message}`
            })
        }
    }
}
