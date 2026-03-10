import urls from "../Model/Url.js"
import fs from "fs"

export let autositemapGenerator = async () => {

    try {

        let urlList = await urls.find()

        if (!urlList.length) {
            console.log("No URLs found for sitemap")
            return
        }

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

        urlList.forEach(u => {

            sitemap += `
<url>
<loc>${u.url}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>daily</changefreq>
<priority>0.8</priority>
</url>`

        })

        sitemap += `
</urlset>`

        fs.writeFileSync("./public/sitemap.xml", sitemap)

        console.log("Sitemap Generated Successfully")

    } catch (error) {

        console.log("Sitemap generation error:", error)

    }

}