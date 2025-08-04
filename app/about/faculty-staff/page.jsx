"use client"

import { useState, useEffect } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"

export default function FacultyStaffPage() {
  const [faculty, setFaculty] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const facultyRef = ref(database, "faculty")
      const staffRef = ref(database, "staff")

      // Fetch faculty data
      onValue(facultyRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const facultyArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setFaculty(facultyArray)
        }
      })

      // Fetch staff data
      onValue(staffRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const staffArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setStaff(staffArray)
        }
        setLoading(false)
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 font-mirage">Faculty & Staff</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-creato-thin">
            Meet our distinguished faculty members and dedicated staff who make our department exceptional
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="faculty" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="faculty" className="px-8 py-3 font-creato-bl">
                Faculty
              </TabsTrigger>
              <TabsTrigger value="staff" className="px-8 py-3 font-creato-bl">
                Staff
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="faculty" className="mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {faculty.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-slate-100">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2 font-mirage">{member.name}</h3>
                      <p className="text-cyan-600 font-medium font-eloquia-text text-xl">{member.position}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Specialization:</p>
                        <p className="font-dot-matrix">{member.specialization}</p>
                      </div>

                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Education:</p>
                        <p className="font-dot-matrix">{member.education}</p>
                      </div>

                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Experience:</p>
                        <p className="font-dot-matrix">{member.experience}</p>
                      </div>

                      {member.publications && (
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Publications:</p>
                          <p className="font-dot-matrix">{member.publications}</p>
                        </div>
                      )}

                      {member.awards && member.awards.length > 0 && (
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Awards:</p>
                          <ul className="list-disc list-inside font-dot-matrix">
                            {member.awards.map((award, idx) => (
                              <li key={idx}>{award}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-slate-800 mb-1 font-eloquia-text">Bio:</p>
                        <p className="text-justify font-dot-matrix">{member.bio}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-slate-600" />
                          <span className="text-gray-700 text-md font-dot-matrix">{member.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-slate-600" />
                          <span className="text-gray-700 text-md font-dot-matrix">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {staff.map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square bg-slate-100">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-1 font-mirage">{member.name}</h3>
                    <p className="text-cyan-600 font-medium mb-4 font-eloquia-text">{member.position}</p>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-600" />
                        <span className="text-gray-700 font-dot-matrix">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-600" />
                        <span className="text-gray-700 font-dot-matrix">{member.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
