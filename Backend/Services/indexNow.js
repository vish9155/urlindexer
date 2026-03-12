export let indexNow = async (url) => {

    try {

        let domain = new URL(url).origin
        let host = new URL(url).hostname
        console.log("host==",host)
        let payload = {
            host: host,
            key: "c49d48ca44684f069b4582ce46c495f7",
            keyLocation: `${domain}/c49d48ca44684f069b4582ce46c495f7.txt`,
            urlList: [url]
        }

        let endpoints = [
            "https://api.indexnow.org/indexnow",
            "https://www.bing.com/indexnow"
        ]

        for (let endpoint of endpoints) {

            try {

                let res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })

                console.log("IndexNow response:", res.status)

            } catch (error) {

                console.log("IndexNow Failed:", error.message)

            }

        }

    } catch (error) {

        console.log("IndexNow Error:", error.message)

    }

}