export let sitemapPing = async (url) => {

    try {

        let domain = new URL(url).origin

        let sitemap = `${domain}/sitemap.xml`

        let engines = [
            `https://www.google.com/ping?sitemap=${sitemap}`,
            `https://www.bing.com/ping?sitemap=${sitemap}`,
            `https://yandex.com/ping?sitemap=${sitemap}`
        ]

        for (let engine of engines) {

         await fetch(engine, {
                headers: {
                    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
                }
            })

        }

        console.log("Sitemap Pinged:", sitemap)

    } catch (error) {

        console.log("Sitemap Ping Error:", error.message)

    }

}