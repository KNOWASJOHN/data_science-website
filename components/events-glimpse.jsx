"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/image-carousel"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"
import { useEffect, useState } from "react"
import Link from "next/link"

export function EventsGlimpse() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventsRef = ref(database, 'hackathons/upcoming');
    
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert the object to an array and sort by date
          const eventsArray = Object.values(data)
            .filter(event => new Date(event.startDate) >= new Date()) // Only upcoming events
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 3); // Only take the first 3 events
          setEvents(eventsArray);
        } else {
          setEvents([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching events:", error);
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Loading Events...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-red-600">Error loading events</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 font-mirage">Upcoming Events</h2>
          <Button
            variant="outline"
            className="border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white bg-transparent font-eloquia-text"
          >
            View All Events
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48">
                {event.images ? (
                  <ImageCarousel images={event.images} alt={event.title} className="h-full" />
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center p-4">
                      <h4 className="font-mirage font-semibold">{event.title}</h4>
                      <p className="font-dot-matrix text-sm mt-2">{event.description}</p>
                    </div>
                  </div>
                )}
                {event.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-cyan-600 hover:bg-cyan-700">Featured</Badge>
                  </div>
                )}
                {event.prizes && (
                  <div className="absolute bottom-3 right-3">
                    <Badge className="text-sm bg-yellow-500 hover:bg-yellow-600 font-creato-thin">Prize: {event.prizes}</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <Badge
                  variant="outline"
                  className="mb-2 border-slate-300 text-slate-600 hover:bg-slate-100 font-normal font-creato-bl"
                >
                  {event.participants ? `${event.participants} Participants` : "Open Registration"}
                </Badge>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 font-mirage tracking-wide">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 font-eloquia-text tracking-loose">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-700 font-dot-matrix">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-cyan-600" />
                    <span>{event.time || "All Day"}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-cyan-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700 p-0 h-auto font-medium font-creato-thin">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
