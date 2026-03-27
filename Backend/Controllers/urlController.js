import urls from "../Model/Url.js";
import indexQueue from "../Queue/indexQueue.js";

export let singleurl = async (req, resp) => {
    try {
        let { url } = req.body;

        let existing = await urls.findOne({ url })

        if (existing) {
            return resp.json({
                message: "Url already exists"
            })
        }
        let newurls = await urls.create({ url, status: "pending" })

        await indexQueue.add("index-job", {
            id: newurls._id,
            url: url
        }, {
            priority: 1,
            attempts: 5,
            backoff: { type: "exponential", delay: 30000 }
        })
        resp.json({
            success: true,
            message: "URL added to queue",
            id: newurls._id,
            url

        })

    } catch (error) {
        resp.json({ message: "Problem in Adding the new url", error, status: false })
    }

}

export let listUrls = async (req, resp) => {
    try {
        let status = req.query.status
        let page = Math.max(Number(req.query.page || 1), 1)
        let limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100)

        let filter = {}

        if (status) {
            filter.status = status
        }

        let [items, total, statusSummary] = await Promise.all([
            urls.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            urls.countDocuments(filter),
            urls.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])
        ])

        resp.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            statusSummary,
            items
        })
    } catch (error) {
        resp.status(500).json({
            success: false,
            message: "Problem fetching urls",
            error: error.message
        })
    }
}

export let retryUrl = async (req, resp) => {
    try {
        let { id } = req.params
        let record = await urls.findById(id)

        if (!record) {
            return resp.status(404).json({
                success: false,
                message: "URL not found"
            })
        }

        await urls.findByIdAndUpdate(id, {
            status: "pending",
            lastError: null
        })

        await indexQueue.add("index-job", {
            id: record._id,
            url: record.url
        }, {
            priority: 1,
            attempts: 5,
            backoff: { type: "exponential", delay: 30000 }
        })

        resp.json({
            success: true,
            message: "URL requeued",
            id: record._id,
            url: record.url
        })
    } catch (error) {
        resp.status(500).json({
            success: false,
            message: "Problem retrying url",
            error: error.message
        })
    }
}
