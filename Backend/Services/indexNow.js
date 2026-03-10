export let indexNow = async (url) => {

    let host = new URL(url).hostname

    let endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow"
    ]

    for (let endpoint of endpoints) {

        try {

            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
                },
                body: JSON.stringify({
                    host: host,
                    key: "6548644772b34d88888686a81e0835a6",
                    urlList: [url]
                })
            })

        } catch (error) {

            console.log("IndexNow Failed:", error.message)

        }

    }
}