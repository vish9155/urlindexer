import mongoose from "mongoose";


let urlschema = await mongoose.Schema({
    url: { type: String, required: true },
    status: { type: String, default: 'pending' },
    indexedAt: { type: Date },
    submittedAt: { type: Date },
    lastCheckedAt: { type: Date },
    lastError: { type: String }
}, { timestamps: true })

let urls = await mongoose.model("url", urlschema, "url")
export default urls
