export let googleSearchCheck = async (url) => {

    let query = `https://www.google.com/search?q=site:${url}`

    let res = await fetch(query, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })

    let html = await res.text()

    if (html.includes(url)) {
        console.log("Indexed")
    } else {
        console.log("Not Indexed Yet")
    }

}