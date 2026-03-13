export let googleSearchCheck =async (url) => {

 try {

  let query = `https://www.google.com/search?q=site:${url}`

  let res = await fetch(query, {
   headers: {
    "User-Agent": "Mozilla/5.0"
   }
  })

  let html = await res.text()

  if (html.includes(url)) {

   console.log("Instant Indexed:", url)

   return true

  }

  return false

 } catch (error) {

  console.log("Instant check failed:", error.message)

  return false

 }

}