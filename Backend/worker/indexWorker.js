import dotenv from 'dotenv'
dotenv.config()
import { Worker } from 'bullmq'
import { indexNow } from '../Services/indexNow.js'
import { googleIndexer } from '../Services/googleIndex.js'
import { sitemapPing } from "../Services/sitemapPing.js"
import { rssPing } from '../Services/rssPing.js'
import urls from '../Model/Url.js'
import dbConect from '../Config/db.js'
import { googleSearchConsole } from '../Services/googleSearchconsole.js'
import { googleSearchCheck } from '../Services/googleSearchCheck.js'
console.log("Indexer Worker Running")

dbConect()

let worker = new Worker("indexQueue", async (job) => {
    console.log("Job Recieved", job.data)
    let { url, id } = job.data
    try {

        await urls.findByIdAndUpdate(id, { status: "processing" })


        await indexNow(url)
        await sitemapPing(url)
        await rssPing(url)
        await googleIndexer(url)

       await new Promise(resolve => setTimeout(resolve, 20000))
        let indexed = false

        try {

            let result = await googleSearchConsole(url)

            if (result.coverageState?.toLowerCase().includes("indexed")) {
                indexed = true
            }

        } catch (err) {

            console.log("GoogleSearchConsole failed, using Google search fallback")

            indexed = await googleSearchCheck(url)

        }

        if (indexed) {

            await urls.findByIdAndUpdate(id, {
                status: "indexed",
                indexedAt: new Date()
            })

            console.log("URL Indexed:", url)

        } else {

            await urls.findByIdAndUpdate(id, {
                status: "not-indexed"
            })

            console.log("URL Not Indexed:", url)

        }


    } catch (error) {
        console.log("Worker error", error.message)
        await urls.findByIdAndUpdate(id, {
            status: "failed",

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


