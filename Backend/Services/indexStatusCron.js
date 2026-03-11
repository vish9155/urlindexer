import cron from "node-cron"
import urls from "../Model/Url.js"
import { googleSearchCheck } from "./googleSearchCheck.js"

export let startIndexCheckCron = () => {

    cron.schedule("*/10 * * * *", async () => {

        console.log("Cron: Checking not indexed URLs")

        try {

            let list = await urls.find({
                status: { $in: ["processing", "not-indexed", "pending"] }
            }).limit(20)

            for (let u of list) {

                let indexed = await googleSearchCheck(u.url)

                if (indexed) {

                    await urls.findByIdAndUpdate(u._id, {
                        status: "indexed",
                        indexedAt: new Date()
                    })

                    console.log("Cron Indexed:", u.url)

                }

            }

        } catch (error) {

            console.log("Cron error:", error.message)

        }

    })

}