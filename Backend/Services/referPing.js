export const referrerPing = async (url) => {

try {

const refs = [

`https://www.google.com/search?q=${encodeURIComponent(url)}`,
`https://www.bing.com/search?q=${encodeURIComponent(url)}`,
`https://search.yahoo.com/search?p=${encodeURIComponent(url)}`

]

const requests = refs.map(r =>

fetch(r,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})
.then(()=>console.log("Referrer ping:",r))
.catch(()=>console.log("Referrer failed:",r))

)

await Promise.all(requests)

} catch (error) {

console.log("Referrer error", error.message)

}

}