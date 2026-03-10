import React,{useState} from 'react'
export default function Home() {
  

  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const urls = [
      url
    ];

    try {
      const res = await fetch("http://usrailwaybooking.com/url/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      alert(data.message || "Submitted!");
    } catch (err) {
      alert("Error submitting URLs");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">
            FastIndexer
          </h1>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Instant URL Indexer
        </h2>

        <p className="mt-4 text-gray-600">
          Submit your URLs and get them indexed faster using
          Google Ping, IndexNow, RSS Ping & Sitemap Ping.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <form onSubmit={submitHandler} className="space-y-6">

          {/* Single URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Single URL
            </label>

            <input
              type="url"
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Submitting..." : "Submit URLs"}
          </button>

        </form>

      </div>

    </div>
  );
}
  
