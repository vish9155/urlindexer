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
        let newurls = await urls.create({ url })

        await indexQueue.add("index-job", {
            id: newurls._id,
            url: url
        }, {
            priority: 1
        })
        resp.json({
            success: true,
            message: "URL added to queue",
            url

        })

    } catch (error) {
        resp.json({ message: "Problem in Adding the new url", error, status: false })
    }

}