export let googleSearchCheck =async (url) => {

 try {

  let query = `https://www.google.com/search?q=${encodeURIComponent(`site:${url}`)}`

  let res = await fetch(query, {
   headers: {
    "User-Agent": "Mozilla/5.0"
   }
  })

  if (!res.ok) {
   throw new Error(`Google search returned ${res.status}`)
  }

  let html = await res.text()

  if (html.includes(url) && !html.toLowerCase().includes("unusual traffic")) {

   console.log("Instant Indexed:", url)

   return true

  }

  return false

 } catch (error) {

  console.log("Instant check failed:", error.message)

  return false

 }

}
