import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Briefcase } from "lucide-react"

export function ProgramsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6 font-mirage">Academic Programs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-eloquia-text italic">
            Our comprehensive curriculum is designed to provide students with both theoretical knowledge and practical
            skills needed in the data science industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift flex flex-col h-full">
            <CardHeader className="text-center pb-4">
              <GraduationCap className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-slate-800 font-mirage tracking-wide">B.Tech Data Science</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-gray-600 mb-2 font-eloquia-text text-1.5sm leading-tight text-center">
                  A comprehensive 4-year undergraduate program covering fundamentals of data science, programming,
                  statistics, and machine learning.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mt-4 mb-6 font-dot-matrix">
                  <li>• Programming in Python & R</li>
                  <li>• Statistical Analysis</li>
                  <li>• Machine Learning Algorithms</li>
                  <li>• Data Visualization</li>
                  <li>• Big Data Technologies</li>
                </ul>
              </div>
              <Button className="w-full bg-cyan-600 hover:text-gray-800 hover:bg-cyan-600 mt-auto font-creato-thin tracking-wide">Learn More</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift flex flex-col h-full">
            <CardHeader className="text-center pb-4">
              <BookOpen className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-slate-800 tracking-wide font-mirage">Research Programs</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-gray-600 mb-6 font-eloquia-text text-1.5sm leading-tight text-center">
                  Engage in cutting-edge research projects in collaboration with faculty and industry partners.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mt-4 mb-6 font-dot-matrix">
                  <li>• AI in Healthcare</li>
                  <li>• Natural Language Processing</li>
                  <li>• Computer Vision</li>
                  <li>• IoT Data Analytics</li>
                  <li>• Blockchain Technology</li>
                </ul>
              </div>
              <Button className="w-full bg-cyan-600 hover:text-gray-800 hover:bg-cyan-600 mt-auto font-creato-thin tracking-wide">Explore Research</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift flex flex-col h-full">
            <CardHeader className="text-center pb-4">
              <Briefcase className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-slate-800 font-mirage tracking-wide">Industry Training</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-gray-600 mb-6 font-eloquia-text text-1.5sm leading-tight text-center">
                  Hands-on training programs and internships with leading technology companies and startups.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mt-4 mb-6 font-dot-matrix">
                  <li>• 6-month Industry Internship</li>
                  <li>• Live Project Experience</li>
                  <li>• Mentorship Programs</li>
                  <li>• Certification Courses</li>
                  <li>• Placement Assistance</li>
                </ul>
              </div>
              <Button className="w-full bg-cyan-600 hover:text-gray-800 hover:bg-cyan-600 mt-auto font-creato-thin tracking-wide">View Opportunities</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
