import dotenv from 'dotenv'
dotenv.config()
import { Queue } from "bullmq"

let connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}

let indexQueue = new Queue("indexQueue", {
    connection,
      limiter: {
        max: 10,
        duration: 1000
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
        removeOnComplete: {
            age: 3600,
            count: 1000
        }
        ,
        removeOnFail: {
            age: 86400,

        }
    }
})

export default indexQueue