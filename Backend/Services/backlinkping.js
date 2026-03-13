export let backlinkGenerator = async (url) => {

try{

let backlinks=[

`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}`,
`https://www.reddit.com/submit?url=${encodeURIComponent(url)}`,
`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

]

let requests = backlinks.map(link =>

fetch(link,{
headers:{ "User-Agent":"Mozilla/5.0" }
})
.then(()=>console.log("Backlink Signal:",link))
.catch(err=>console.log("Backlink Failed:",err.message))

)

await Promise.all(requests)

}catch(error){

console.log("Backlink generator error:",error.message)

}

}