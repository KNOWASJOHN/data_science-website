import { Card, CardContent } from "@/components/ui/card"
import { Brain, Database, TrendingUp, Users } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 font-mirage">About Our Department</h2>
          <p className="text-lg md:text-md text-gray-800 leading-normal font-eloquia-text italic ">
            Established in 2024, the Department of Data Science at Christ College of Engineering, Irinjalakuda aims to
            equip students with the knowledge and skills required in today's data-driven world. The department offers a
            comprehensive undergraduate program covering key areas like statistics, machine learning, artificial
            intelligence, and big data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 font-mirage">Our Mission</h3>
            <p className="text-base md:text-lg text-gray-600 mb-6 leading-normal font-eloquia-text italic">
              With a focus on hands-on learning, industry exposure, and ethical practices, the department fosters
              innovation, critical thinking, and problem-solving skills essential for success in the rapidly evolving
              field of data science.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-normal font-eloquia-text italic">
              We are committed to producing graduates who can contribute meaningfully to society through data-driven
              insights and solutions.
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-8 text-white">
            <h4 className="text-xl md:text-2xl font-bold mb-4 font-mirage tracking-wide ">Our Vision</h4>
            <p className="text-base md:text-lg leading-normal font-eloquia-text italic">
              To be a leading center of excellence in data science education and research, fostering innovation and
              creating future leaders who will drive technological advancement and societal progress.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
            <CardContent className="pt-6">
              <Brain className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 font-mirage">AI & ML</h4>
              <p className="text-2sm md:text-base text-gray-600 font-dot-matrix">
                Advanced artificial intelligence and machine learning techniques
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
            <CardContent className="pt-6">
              <Database className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 font-mirage">Big Data</h4>
              <p className="text-2sm md:text-base text-gray-600 font-dot-matrix">Processing and analyzing large-scale datasets</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 font-mirage">Analytics</h4>
              <p className="text-2sm md:text-base text-gray-600 font-dot-matrix">Statistical analysis and predictive modeling</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover-lift">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h4 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 font-mirage">Industry Connect</h4>
              <p className="text-2sm md:text-base text-gray-600 font-dot-matrix">Strong partnerships with leading tech companies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
