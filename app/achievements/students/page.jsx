"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Users, Briefcase, Laptop } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { useEffect, useState } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const achievementsRef = ref(database, "achievements/student")
    onValue(achievementsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const achievementsArray = Object.keys(data).map((key) => {
          const { title, description, date, category, students, batch, images, name } = data[key]
          return {
            id: key,
            name: name || "",
            title: title || "",
            description: description || "",
            date: date || "",
            category: category || "",
            students: students || [],
            batch: batch || "",
            images: images || [],
          }
        })
        setAchievements(achievementsArray)
      } else {
        setAchievements([])
      }
    })

    // Cleanup subscription on unmount
    return () => {
      onValue(achievementsRef, () => {})
    }
  }, [])

  // Category colors
  const categoryColors = {
    Competition: "bg-amber-100 text-amber-800",
    Research: "bg-cyan-100 text-cyan-800",
    Recognition: "bg-blue-100 text-blue-800",
    Award: "bg-green-100 text-green-800",
    Placement: "bg-purple-100 text-purple-800",
    Scholarship: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Student Achievements</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Celebrating the outstanding accomplishments of our talented students
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <Card
              key={achievement.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <ImageCarousel images={achievement.images} alt={achievement.title} className="h-full" />
                <div className="absolute top-3 right-3">
                  <Badge className={categoryColors[achievement.category] || "bg-slate-100 text-slate-800"}>
                    {achievement.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {achievement.icon}
                  <div className="ml-3">
                    <div className="flex items-center">
                      {achievement.students.length > 1 ? (
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-1 text-slate-600" />
                          <span className="font-semibold text-slate-800">{achievement.name}</span>
                        </div>
                      ) : (
                        <h3 className="text-lg font-bold text-slate-800 text-center">{achievement.name}</h3>
                      )}
                    </div>
                    <p className="text-sm text-cyan-600 font-medium">Batch: {achievement.batch}</p>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">{achievement.title}</h4>

                {achievement.students.length > 1 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-slate-700">Studen ts: </span>
                    <span className="text-sm text-slate-600">{achievement.name}</span>
                  </div>
                )}

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{achievement.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{achievement.date}</span>
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
