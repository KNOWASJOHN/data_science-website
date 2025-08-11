"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export function NewsSection() {
  const [news, setNews] = useState([])
  const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY  // Updated variable name

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
        const query = encodeURIComponent(
          "(artificial intelligence OR AI OR machine learning OR deep learning OR computer science)"
        )

        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${query}&lang=en&max=20&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`)
        const data = await res.json()
        const uniqueArticles = removeDuplicates(data.articles || [])
        setNews(uniqueArticles.slice(0, 6)) // Limit to 6 after filtering
      } catch (err) {
        console.error("Error fetching news:", err)
      }
    }
    fetchNews()
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
          {news.length > 0 ? (
            news.map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-2 font-dot-matrix">
                    <Calendar className="h-5 w-4 mr-3 " />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </div>
                  <CardTitle className="text-xl text-slate-800 leading-tight tracking-wide font-creato-thin">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-md text-gray-600 mb-4 text-left font-eloqcuia-text tracking-tight">
                    {item.description || "No description available."}
                  </p>
                  <Button
                    variant="outline"
                    className="flex justify-center w-full group mt-2 p-1 font-creato-thin tracking-wide"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">Loading latest news...</p>
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
