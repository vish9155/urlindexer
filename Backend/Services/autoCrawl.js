export let crawlBooster = async (url) => {

try{

const bots=[
"Googlebot",
"Googlebot-News",
"Googlebot-Image",
"Bingbot",
"Slurp",
"DuckDuckBot"
]

const requests = bots.map(bot =>

fetch(url,{
method:"GET",
headers:{
"User-Agent":bot,
"Accept":"text/html",
"Accept-Language":"en-US,en;q=0.9",
"Connection":"keep-alive"
}
})
.then(()=>console.log("Crawl Triggered:",bot))
.catch(err=>console.log("Bot Failed:",bot,err.message))

)

await Promise.all(requests)

}catch(error){

console.log("Crawl Booster Error:",error.message)

}

}