import cron from "node-cron"
import urls from "../Model/Url.js"
import { googleSearchCheck } from "../Services/googleSearchCheck.js"

export let startStatusCron = ()=>{

cron.schedule("*/15 * * * *", async ()=>{

console.log("Checking indexed urls")

let list = await urls.find({
status:"submitted"
}).limit(100)

for(let u of list){

let indexed = await googleSearchCheck(u.url)

if(indexed){

await urls.findByIdAndUpdate(u._id,{
status:"indexed",
indexedAt:new Date()
})

console.log("Indexed:",u.url)

}

}

})

}