import dotenv from 'dotenv'
dotenv.config()
import { Worker } from 'bullmq'
import { indexNow } from '../Services/indexNow.js'
import { googleIndexer } from '../Services/googleIndex.js'
import { sitemapPing } from "../Services/sitemapPing.js"
import { rssPing } from '../Services/rssPing.js'
import urls from '../Model/Url.js'
import dbConect from '../Config/db.js'
import { crawlBooster } from '../Services/autoCrawl.js'
import { backlinkGenerator } from '../Services/backlinkping.js'
import { referrerPing } from '../Services/referPing.js'
import { getRedisConnection } from '../utils/redisConfig.js'
console.log("Indexer Worker Running")

dbConect()

let worker = new Worker("indexQueue", async (job) => {
    console.log("Job Recieved", job.data)
    let { url, id } = job.data
    try {

        await urls.findByIdAndUpdate(id, {
            status: "processing",
            lastError: null
        })
        let submissionSteps = await Promise.allSettled([
            crawlBooster(url),
            backlinkGenerator(url),
            googleIndexer(url),
            indexNow(url),
            sitemapPing(url),
            rssPing(url),
            referrerPing(url)
        ])

        let rejectedSteps = submissionSteps.filter(step => step.status === "rejected")
        let submissionSummary = submissionSteps.map((step, index) => {
            let labels = [
                "crawlBooster",
                "backlinkGenerator",
                "googleIndexer",
                "indexNow",
                "sitemapPing",
                "rssPing",
                "referrerPing"
            ]

            if (step.status === "fulfilled") {
                return `${labels[index]}: success`
            }

            return `${labels[index]}: failed - ${step.reason?.message || "unknown error"}`
        })

        if (rejectedSteps.length === submissionSteps.length) {
            throw new Error("All indexing submissions failed")
        }

        await urls.findByIdAndUpdate(id, {
            status: "submitted",
            submittedAt: new Date(),
            lastError: rejectedSteps[0]?.reason?.message || null,
            lastSubmissionSummary: submissionSummary
        })

        console.log("Submitted:", url, submissionSummary)


    } catch (error) {
        console.log("Worker error", error.message, "for", url)
        await urls.findByIdAndUpdate(id, {
            status: "failed",
            lastError: error.message,
            lastSubmissionSummary: [`worker: failed - ${error.message}`]
        })
        throw error
    }
},
    {
        connection: getRedisConnection(),
        concurrency: 20,
        lockDuration: 300000,
        stalledInterval: 60000
    }
)

worker.on("completed", (job) => {
    console.log("Job Completed:", job.id, "attempt", job.attemptsMade + 1)
})

worker.on("failed", (job, err) => {
    console.log(` Job id is___ ${job?.id} failed on attempt ${job?.attemptsMade}:`, err.message);
});


