import indexQueue from "../Queue/indexQueue.js"
import urls from "../Model/Url.js"

export const enqueueUrlJob = async (record) => {
    let jobId = String(record._id)

    await indexQueue.add("index-job", {
        id: record._id,
        url: record.url
    }, {
        jobId,
        priority: 1,
        attempts: 5,
        backoff: { type: "exponential", delay: 30000 }
    })

    await urls.findByIdAndUpdate(record._id, {
        queuedAt: new Date(),
        queueJobId: jobId,
        lastError: null
    })

    return jobId
}
