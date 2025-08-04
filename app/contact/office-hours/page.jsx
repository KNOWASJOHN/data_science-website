"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Phone, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"

export default function OfficeHoursPage() {
  const [facultyOfficeHours, setFacultyOfficeHours] = useState([])

  useEffect(() => {
    const facultyHoursRef = ref(database, "faculty")
    onValue(facultyHoursRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const facultyOfficeHoursArray = Object.keys(data).map((key) => {
          const { name, email, phone, position, office, hours } = data[key];
          return {
            id: key,
            name: name || "",
            email: email || "",
            phone: phone || "",
            position: position || "",
            office: office || "", // Include office
            hours: hours || "",   // Include hours
          };
        })
        setFacultyOfficeHours(facultyOfficeHoursArray)
      } else {
        setFacultyOfficeHours([])
      }
    })

    // Cleanup subscription on unmount
    return () => {
      onValue(facultyHoursRef, () => {})
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 font-mirage">Office Hours</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-creato-thin">Contact information and office hours for faculty and staff</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Department Contact Information */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 font-coolvetica">Department Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 font-eloquia-display">Address</h3>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 mr-3 text-cyan-600 mt-1" />
                  <div className="text-slate-600 font-dot-matrix">
                    <p>Department of Data Science</p>
                    <p>Christ College of Engineering</p>
                    <p>Irinjalakuda, Thrissur, Kerala - 680125</p>
                  </div>
                </div>

                <div className="space-y-3 font-dot-matrix">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-cyan-600" />
                    <span className="text-slate-600">04802825355</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-cyan-600" />
                    <span className="text-slate-600">contact@cce.edu.in</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 font-eloquia-display">General Office Hours</h3>
                <div className="space-y-3 text-slate-600 font-creato-thin font-semibold">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-cyan-600" />
                    <div>
                      <p>
                        <strong className="font-creato-bl text-md font-normal">Monday - Friday:</strong> 9:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-cyan-600" />
                    <div>
                      <p>
                        <strong className="font-creato-bl text-md font-normal">Saturday:</strong> 9:00 AM - 12:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-cyan-600" />
                    <div>
                      <p>
                        <strong className="font-creato-bl text-md font-normal">Lunch Break:</strong> 12:30 PM - 1:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Office Hours */}
        <div> 
          <h2 className="text-3xl font-bold text-slate-800 mb-8 font-mirage">Faculty Office Hours</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyOfficeHours.map((faculty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-slate-800 tracking-normal font-mirage">
                    <User className="h-5 w-5 mr-2 text-cyan-600" />
                    {faculty.name}
                  </CardTitle>
                  <p className="text-cyan-600 font-medium font-coolvetica">{faculty.position}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-slate-600 mt-1" />
                    <span className="text-slate-600 text-sm font-creato-bl">{faculty.office}</span>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 text-slate-600 mt-1" />
                    <span className="text-slate-600 text-sm font-creato-bl">{faculty.hours}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center mb-4">
                      <Mail className="h-4 w-4 mr-2 text-slate-600" />
                      <span className="text-slate-600 text-sm font-creato-bl">{faculty.email}</span>
                    </div>
                    <div className="flex items-center ">
                      <Phone className="h-4 w-4 mr-2 text-slate-600" />
                      <span className="text-slate-600 text-sm font-creato-bl">{faculty.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 font-coolvetica tracking-normal text-center">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-slate-600 font-eloquia-text text-center">
                <p>
                  <strong className="font-coolvetica text-lg font-medium">Appointments:</strong> While faculty maintain regular office hours, it's recommended to
                  schedule appointments in advance for important discussions or meetings.
                </p>
                <p>
                  <strong className="font-coolvetica text-lg font-medium">Emergency Contact:</strong> For urgent matters outside office hours, please contact the main
                  office at 04802825355.
                </p>
                <p>
                  <strong className="font-coolvetica text-lg font-medium">Holiday Schedule:</strong> Office hours may vary during holidays and examination periods.
                  Please check with the department for updated schedules.
                </p>
                <p>
                  <strong className="font-coolvetica text-lg font-medium">Student Consultation:</strong> Faculty are available for student consultation during their
                  office hours. No prior appointment needed for general academic queries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
