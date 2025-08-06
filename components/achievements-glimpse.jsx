"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, BookOpen, Star, Users, Briefcase, Laptop, Globe, FileText, Bookmark,Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/image-carousel"
import { useEffect, useState } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"

export function AchievementsGlimpse() {
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    // Fetch recent achievements from all three categories
    const fetchAchievements = async () => {
      const paths = {
        student: ref(database, "achievements/student"),
        faculty: ref(database, "achievements/faculty"),
        department: ref(database, "achievements/department")
      }

      let latestAchievements = {}

      Object.entries(paths).forEach(([type, reference]) => {
        onValue(reference, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            // Get the most recent achievement for this category
            const items = Object.keys(data).map(key => ({
              ...data[key],
              id: key,
              type: type
            }))
            // Sort by date (assuming date is in a format that can be compared)
            const sortedItems = items.sort((a, b) => new Date(b.date) - new Date(a.date))
            const mostRecent = sortedItems[0]

            setAchievements(prev => {
              const filtered = prev.filter(item => item.type !== type)
              return [...filtered, mostRecent].sort((a, b) => {
                // Custom sort order: student, faculty, department
                const typeOrder = { student: 1, faculty: 2, department: 3 }
                return typeOrder[a.type] - typeOrder[b.type]
              })
            })
          }
        })
      })
    }

    fetchAchievements()

    // Cleanup subscriptions
    return () => {
      const paths = ["student", "faculty", "department"]
      paths.forEach(path => {
        const reference = ref(database, `achievements/${path}`)
        onValue(reference, () => { })
      })
    }
  }, [])

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
    Medal: <Medal className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />,
    BookOpen: <BookOpen className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`} />,
    Users: <Users className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
    Briefcase: <Briefcase className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
    Laptop: <Laptop className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
    Globe: <Globe className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
    FileText: <FileText className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
    Bookmark: <Bookmark className={`h-8 w-8 ${iconColors[Math.floor(Math.random() * iconColors.length)]}`}/>,
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 font-mirage">Recent Achievements</h2>
          <Button
            variant="outline"
            className="border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white bg-transparent font-eloquia-text "
          >
            View All Achievements
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {achievements.slice(0, 3).map((achievement, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden font-coolvetica tracking-wide">
                <ImageCarousel images={achievement.images || []} alt={achievement.title} className="h-full" style={{ objectFit: 'contain', objectPosition: 'center' }} />
                <div className="absolute top-1 left-2">
                  <Badge className={badgeColors[Math.floor(Math.random() * badgeColors.length)]}>
                    {achievement.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-3 text-center">
                <div className="flex-shrink-0 absolute right-4 bottom-13 grid">
                  {iconMap[achievement.icon]}
                </div>
                <div className="flex items-center justify-center mb-4 gap-3">
                  <div>
                    {(achievement.type === 'student' || achievement.type === 'faculty') ? (<>

                      <h4 className="text-xl font-semibold text-slate-800 line-clamp-2 font-mirage">
                        {achievement.name}
                      </h4></>
                    ) : (
                      <h4 className="text-xl font-semibold text-slate-800 line-clamp-2 font-mirage">
                        {achievement.title}
                      </h4>
                    )}
                  </div>
                </div>

                {achievement.type === 'faculty' && (
                  <h3 className="text-lg font-bold text-cyan-800 font-creato-thin">{achievement.faculty}</h3>
                )}
                {achievement.type === 'student' && (
                  <p className="text-lg text-cyan-800 font-bold tracking-wide font-creato-thin">Batch: {achievement.batch}</p>
                )}
                {achievement.organization && (
                  <p className="text-cyan-800 font-semibold tracking-wide mb-4 text-center font-creato-thin">
                    Awarded by: {achievement.organization}
                  </p>
                )}
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 font-coolvetica">{achievement.description}</p>

                <div className="flex justify-center">
                  <span className="text-sm text-slate-500 font-dot-matrix">{achievement.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links to Achievement Categories */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2 font-mirage">Student Achievements</h3>
              <p className="text-slate-600 text-sm mb-4 font-eloquia-text">
                Celebrating our students' success in competitions, research, and placements
              </p>
              <Button variant="outline" className="w-full bg-transparent font-creato-thin tracking-wide">
                View Student Achievements
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2 font-mirage">Faculty Achievements</h3>
              <p className="text-slate-600 text-sm mb-4 font-eloquia-text">
                Recognizing our faculty's contributions to research and academic excellence
              </p>
              <Button variant="outline" className="w-full bg-transparent font-creato-thin tracking-wide">
                View Faculty Achievements
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2 font-mirage">Department Awards</h3>
              <p className="text-slate-600 text-sm mb-4 font-eloquia-text">
                Awards and recognitions received by our department for excellence
              </p>
              <Button variant="outline" className="w-full bg-transparent font-creato-thin tracking-wide">
                View Department Awards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
