export let googleSearchCheck = async (url) => {

    try {

        let query = `https://www.google.com/search?q=site:${url}`

        let res = await fetch(query, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        })

        let html = await res.text()

        return html.includes(url)

    } catch (error) {

        console.log("Google search check failed:", error.message)

        return false
    }
}