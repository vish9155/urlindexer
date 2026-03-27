import fs from "fs"

const isRunningInDocker = () => {
    try {
        return fs.existsSync("/.dockerenv")
    } catch (error) {
        return false
    }
}

export const getRedisConnection = () => {
    let configuredHost = process.env.REDIS_HOST?.trim()
    let host = configuredHost || "127.0.0.1"

    if (host === "redis" && !isRunningInDocker()) {
        host = "127.0.0.1"
    }

    return {
        host,
        port: Number(process.env.REDIS_PORT || 6379)
    }
}
