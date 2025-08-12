"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export function NewsSection() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Deduplication function
  function removeDuplicates(articles) {
    const seen = new Set()
    return articles.filter(article => {
      const key = article.title.trim().toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true)
        setError(null)
        
        // Simplified query - NewsData.io might not support complex OR queries
        const query = "artificial intelligence"
        
        // Build URL with proper parameters
        const params = new URLSearchParams({
          apikey: process.env.NEXT_PUBLIC_NEWDATA_API_KEY,
          q: query,
          language: 'en',
          size: '10' // Limit results
        })
        
        const url = `https://newsdata.io/api/1/news?${params.toString()}`
        console.log('Fetching from:', url.replace(process.env.NEXT_PUBLIC_NEWDATA_API_KEY, 'API_KEY_HIDDEN'))
        
        const res = await fetch(url)
        
        // Always try to parse response, even on error
        let data
        try {
          data = await res.json()
        } catch (parseError) {
          throw new Error(`Failed to parse response: ${parseError.message}`)
        }
        
        console.log('API Response:', data)
        
        // Check if the response is ok
        if (!res.ok) {
          const errorMessage = data.message || data.error || `HTTP error! status: ${res.status}`
          throw new Error(errorMessage)
        }
        
        // Check if the API returned an error in the data
        if (data.status === 'error') {
          throw new Error(data.message || 'API returned an error')
        }
        
        // Process and set the news data
        if (data.results && Array.isArray(data.results)) {
          const uniqueNews = removeDuplicates(data.results)
          // Limit to first 6 articles for better display
          setNews(uniqueNews.slice(0, 6))
        } else {
          console.warn('No results found in API response')
          setNews([])
        }
        
      } catch (err) {
        console.error("Error fetching news:", err)
        setError(err.message)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if API key is available
    if (process.env.NEXT_PUBLIC_NEWDATA_API_KEY) {
      fetchNews()
    } else {
      console.error('NEXT_PUBLIC_NEWDATA_API_KEY is not set')
      setError('API key not configured')
      setLoading(false)
    }
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6 font-mirage">
            AI & Tech News (Global)
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-eloquia-text italic">
            Stay updated with the latest developments, breakthroughs, and innovations in Artificial Intelligence and technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-3 text-center text-gray-500">Loading latest news...</p>
          ) : error ? (
            <div className="col-span-3 text-center">
              <p className="text-red-500 mb-4">Error loading news: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : news.length > 0 ? (
            news.map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={item.image_url || "https://png.pngtree.com/thumb_back/fw800/background/20231226/pngtree-futuristic-quantum-computer-technologies-a-design-of-technology-circuit-board-texture-image_13926456.png"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-md text-gray-500 mb-2 font-dot-matrix">
                    <Calendar className="h-5 w-4 mr-3" />
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Unknown date"}
                  </div>
                  <CardTitle className="text-xl text-slate-800 leading-tight tracking-wide font-creato-thin">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 text-left font-eloquia-text tracking-tight line-clamp-4">
                    {item.description || "No description available."}
                  </p>
                  <Button
                    variant="outline"
                    className="flex justify-center w-full group mt-2 p-1 font-creato-thin tracking-wide"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No news articles found.</p>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 font-eloquia-text">
            View All News & Updates
          </Button>
        </div>
      </div>
    </section>
  )
}