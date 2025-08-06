"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BookOpen, Globe, Users, FileText, Bookmark } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"
import { useEffect, useState } from "react"

const iconMap = {
  Award: <Award className="h-8 w-8 text-cyan-600" />,
  BookOpen: <BookOpen className="h-8 w-8 text-cyan-600" />,
  Globe: <Globe className="h-8 w-8 text-cyan-600" />,
  Users: <Users className="h-8 w-8 text-cyan-600" />,
  FileText: <FileText className="h-8 w-8 text-cyan-600" />,
  Bookmark: <Bookmark className="h-8 w-8 text-cyan-600" />,
}

export default function FacultyAchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Starting Firebase connection for achievements...")
    try {
      const achievementsRef = ref(database, "achievements/faculty")

      onValue(
        achievementsRef,
        (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const achievementsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }))
            setAchievements(achievementsArray)
          } else {
            setAchievements([])
          }
          setLoading(false)
        },
        (error) => {
          console.error("Firebase error:", error)
          setError(error.message)
          setLoading(false)
        }
      )
    } catch (err) {
      console.error("Error setting up Firebase:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  const processAchievement = (achievement) => {
    return {
      ...achievement,
      faculty: achievement.faculty || "Unknown Faculty",
      title: achievement.title || "Untitled Achievement",
      description: achievement.description || "",
      date: achievement.date || "",
      category: achievement.category || "Uncategorized",
      icon: achievement.icon ? iconMap[achievement.icon] : <Award className="h-8 w-8 text-cyan-600" />,
      images: Array.isArray(achievement.images) ? achievement.images : [],
    }
  }

  const processedAchievements = achievements.map(processAchievement)

  // Category colors
  const categoryColors = {
    "Research Grant": "bg-cyan-100 text-cyan-800",
    Award: "bg-amber-100 text-amber-800",
    Patent: "bg-green-100 text-green-800",
    Recognition: "bg-blue-100 text-blue-800",
    Collaboration: "bg-purple-100 text-purple-800",
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-xl text-slate-600 font-creato-bl">Loading achievements...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-xl text-red-600">Error loading achievements</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 font-mirage">Faculty Achievements</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-creato-thin">
            Celebrating the accomplishments and recognition of our distinguished faculty members
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedAchievements.map((achievement, index) => (
            <Card
              key={achievement.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <ImageCarousel images={Array.isArray(achievement.images) ? achievement.images : []} alt={achievement.faculty} className="h-full" style={{ objectFit: 'contain', objectPosition: 'center' }} />
                <div className="absolute top-1 left-3">
                  <Badge className={categoryColors[achievement.category] || "bg-slate-100 text-slate-800"}>
                    {achievement.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-3 text-center">
                <div className="items-center mb-4">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-slate-800 line-clamp-2 font-coolvetica">{achievement.id}</h4>
                    <h3 className="text-lg font-bold text-slate-800 font-creato-thin">{achievement.faculty}</h3>
                  </div>
                  <div className="mt-2 flex justify-center">
                    {achievement.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2 font-creato-thin">{achievement.title}</h4>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3 font-creato-thin font-semibold">{achievement.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-dot-matrix">{achievement.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
