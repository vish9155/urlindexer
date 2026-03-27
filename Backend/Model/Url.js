import mongoose from "mongoose";


let urlschema = await mongoose.Schema({
    url: { type: String, required: true },
    status: { type: String, default: 'pending' },
    indexedAt: { type: Date },
    queuedAt: { type: Date },
    submittedAt: { type: Date },
    lastCheckedAt: { type: Date },
    lastError: { type: String },
    lastSubmissionSummary: [{ type: String }],
    queueJobId: { type: String }
}, { timestamps: true })

let urls = await mongoose.model("url", urlschema, "url")
export default urls
