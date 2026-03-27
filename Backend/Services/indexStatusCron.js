import cron from "node-cron"
import urls from "../Model/Url.js"
import { googleSearchCheck } from "../Services/googleSearchCheck.js"
import { googleSearchConsole } from "./googleSearchconsole.js"

export let startStatusCron = ()=>{

cron.schedule("*/5 * * * *", async ()=>{

console.log("Checking indexed urls")

let list = await urls.find({
status:"submitted"
}).limit(100)

for(let u of list){

let indexed = false

try{
let result = await googleSearchConsole(u.url)
let coverageState = result?.coverageState?.toLowerCase() || ""
indexed = coverageState.includes("indexed")
}catch(error){
console.log("Search Console check failed:", u.url, error.message)
indexed = await googleSearchCheck(u.url)
}

await urls.findByIdAndUpdate(u._id,{
lastCheckedAt:new Date()
})

if(indexed){

await urls.findByIdAndUpdate(u._id,{
status:"indexed",
indexedAt:new Date()
})

console.log("Indexed:",u.url)

}

else{
console.log("Still not indexed:",u.url)
}

}
})
}
