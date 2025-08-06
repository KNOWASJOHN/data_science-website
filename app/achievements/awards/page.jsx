"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Medal, Star } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { useEffect, useState } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"

export default function DepartmentAwardsPage() {
  const [awards, setAwards] = useState([])

const badgeColors = [
  "bg-amber-100 text-amber-800",
  "bg-cyan-100 text-cyan-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800"
];

const iconColors = [
  "text-amber-500",
  "text-cyan-600",
  "text-blue-600",
  "text-green-600",
  "text-purple-600",
  "text-pink-600"
];

// Update the iconMap to use random colors
const iconMap = {
  Award: <Award className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />,
  Trophy: <Trophy className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />,
  Star: <Star className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />,
  Medal: <Medal className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />
};

  useEffect(() => {
    const achievementsRef = ref(database, "achievements/department")
    onValue(achievementsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const awardsArray = Object.keys(data).map((key) => {
          const { title, description, date, category, organization, images, icon } = data[key]
          return {
            id: key,
            title: title || "",
            description: description || "",
            date: date || "",
            category: category || "",
            organization: organization || "",
            images: images || [],
            icon: iconMap[icon] || iconMap.Award
          }
        })
        setAwards(awardsArray)
      } else {
        setAwards([])
      }
    })

    // Cleanup subscription on unmount
    return () => {
      onValue(achievementsRef, () => {})
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 font-mirage">Department Awards</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-creato-thin">
            Recognitions and accolades received by the Department of Data Science
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {awards.map((award, index) => (
            <Card
              key={award.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <ImageCarousel images={award.images} alt={award.title} className="h-full" />
                <div className="absolute top-1 left-2 font-coolvetica tracking-wide">
                  <Badge className={badgeColors[Math.floor(Math.random() * badgeColors.length)]}>
                    {award.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">{award.icon}</div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 text-center line-clamp-2 font-mirage">{award.title}</h3>
                <p className="text-cyan-600 font-semibold tracking-wide mb-4 text-center font-creato-thin">Awarded by: {award.organization}</p>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 font-coolvetica">{award.description}</p>


                  <span className="text-md font-normal text-slate-500 font-dot-matrix">{award.date}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Rankings Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center font-mirage">Department Rankings</h2>

          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 font-eloquia-display">National Rankings</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0 font-stretch">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Top Emerging Data Science Department</p>
                        <p className="text-md text-slate-700 font-creato-thin">National Education Survey 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="font-stretch bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Best Industry Collaboration</p>
                        <p className="text-md text-slate-700 font-creato-thin">Tech Education Rankings 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="font-stretch bg-amber-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Research Output in Data Science</p>
                        <p className="text-md text-slate-700 font-creato-thin">Academic Research Index 2023</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 font-eloquia-display">State Rankings</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="font-stretch bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Best Data Science Department</p>
                        <p className="text-md text-slate-700 font-creato-thin">State Higher Education Survey 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="font-stretch bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Student Placement Rate</p>
                        <p className="text-md text-slate-700 font-creato-thin">State Employment Index 2023</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="font-stretch bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 font-creato-bl">Innovation & Entrepreneurship</p>
                        <p className="text-md text-slate-700 font-creato-thin">State Innovation Council Rankings 2023</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
