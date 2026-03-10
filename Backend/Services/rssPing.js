export let rssPing = async (url) => {

  try {

    let domain = new URL(url).origin
    let rss = `${domain}/rss.xml`

    // check rss exist
    let check = await fetch(rss)

    if (!check.ok) {
      console.log("RSS File Not Found:", rss)
      return
    }

    // ping
    let res = await fetch(`https://api.feedping.net/ping?url=${encodeURIComponent(rss)}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    if (!res.ok) {
      throw new Error(`Ping failed ${res.status}`)
    }

    console.log("RSS Ping Success:", rss)

  } catch (error) {

    console.log("RSS Ping Failed:", error.message)

  }

}