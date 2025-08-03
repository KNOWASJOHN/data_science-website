'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"

export function FacultySection() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const facultyRef = ref(database, "faculty")
      const staffRef = ref(database, "staff")

      // Fetch both faculty and staff data
      Promise.all([
        new Promise((resolve) => {
          onValue(facultyRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
              const facultyArray = Object.keys(data).map((key) => ({
                id: key,
                type: 'faculty',
                ...data[key],
              }))
              resolve(facultyArray)
            } else {
              resolve([])
            }
          })
        }),
        new Promise((resolve) => {
          onValue(staffRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
              const staffArray = Object.keys(data).map((key) => ({
                id: key,
                type: 'staff',
                ...data[key],
              }))
              resolve(staffArray)
            } else {
              resolve([])
            }
          })
        })
      ])
      .then(([facultyArray, staffArray]) => {
        // Combine and sort by name, then take first 4
        const combined = [...facultyArray, ...staffArray]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 4)
        setMembers(combined)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching data:", err)
        setError(err.message)
        setLoading(false)
      })
    } catch (err) {
      console.error("Error setting up data listeners:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our distinguished faculty and staff members bring years of experience and excellence to guide
            students in their data science journey.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">Loading team information...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">Error loading team information</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No team information available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <Card key={member.id} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 font-rotifera font-normal">{member.name}</h3>
                    <p className="text-cyan-600 text-md font-eloquia-text ">{member.position}</p>
                    
                    {member.specialization && (
                      <p className="text-sm text-slate-600 font-eloquia-text">
                        {member.specialization}
                      </p>
                    )}

                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-slate-600 text-sm font-dot-matrix">{member.email}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button size="sm" variant="outline" className="w-full bg-transparent hover:bg-cyan-50 border-cyan-600 text-cyan-600 font-eloquia-text">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/about/faculty-staff">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              View All Team Members
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
