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
console.log("Indexer Worker Running")

dbConect()

let worker = new Worker("indexQueue", async (job) => {
    console.log("Job Recieved", job.data)
    let { url, id } = job.data
    try {

        await urls.findByIdAndUpdate(id, { status: "processing" })
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

        if (rejectedSteps.length === submissionSteps.length) {
            throw new Error("All indexing submissions failed")
        }

        await urls.findByIdAndUpdate(id, {
            status: "submitted",
            submittedAt: new Date(),
            lastError: rejectedSteps[0]?.reason?.message || null
        })

        console.log("Submitted:", url)


    } catch (error) {
        console.log("Worker error", error.message)
        await urls.findByIdAndUpdate(id, {
            status: "failed",
            lastError: error.message
        })
    }
},
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        },
        concurrency: 20,
        lockDuration: 300000,
        stalledInterval: 60000
    }
)

worker.on("completed", (job) => {
    console.log("Job Completed:", job.id)
})

worker.on("failed", (job, err) => {
    console.log(` Job id is___ ${job?.id} failed:`, err.message);
});


