"use client"; // Needed for client-side Firebase

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/image-carousel";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { database } from "../database/firebaseConfig";
import { ref, onValue } from "firebase/database";
import Image from "next/image";





export default function EventsHomePage() {

  const [featuredEvents, setFeaturedEvents] = useState([]);

  const badgeColors = [
    "bg-amber-100 text-amber-800",
    "bg-cyan-100 text-cyan-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800"
  ];

  useEffect(() => {
    const eventsRef = ref(database, "featuredevents");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFeaturedEvents(eventsArray);
      }
    });
  }, []);

  const eventCategories = [
    { name: "Workshops & Seminars", description: "Hands-on learning sessions and expert talks", count: 12, icon: "🎓", color: "bg-blue-100 text-blue-800" },
    { name: "Conferences", description: "Academic conferences and symposiums", count: 4, icon: "🏛️", color: "bg-cyan-100 text-cyan-800" },
    { name: "Hackathons", description: "Coding competitions and innovation challenges", count: 6, icon: "💻", color: "bg-red-100 text-red-800" },
    { name: "Webinars", description: "Online sessions with industry experts", count: 8, icon: "🌐", color: "bg-green-100 text-green-800" },
    { name: "Annual Day / Fests", description: "Cultural and technical festivals", count: 3, icon: "🎉", color: "bg-orange-100 text-orange-800" },
    { name: "Timeline", description: "Complete events calendar view", count: "All", icon: "📅", color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 font-mirage">Events</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-creato-thin">
            Discover upcoming events, workshops, conferences, and activities at the Department of Data Science
          </p>
        </div>
      </div>

      {/* Event Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center font-mirage">Event Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {eventCategories.map((category, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center font-creato-thin">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 font-creato-bl tracking-wide">{category.name}</h3>
                <p className="text-slate-800 text-sm mb-4  tracking-wide font-coolvetica text-lg">{category.description}</p>
                <Badge className={badgeColors[Math.floor(Math.random() * badgeColors.length)]}>
                  {typeof category.count === "number" ? `${category.count} Events` : category.count}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Events */}
        <h2 className="text-3xl font-bold text-slate-800 mb-8 font-mirage">Featured Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((evt, index) => (
            <Card
              key={evt.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48">
                <ImageCarousel images={evt.images || ["/placeholder.svg?height=300&width=600"]} alt={evt.title} className="h-full" />
                <div className="absolute top-3 right-3">
                  <Badge className={badgeColors[Math.floor(Math.random() * badgeColors.length)]}>
                    {evt.category}
                  </Badge>
                </div>
                {evt.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className={badgeColors[Math.floor(Math.random() * badgeColors.length)]}>
                      Featured</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6 min-h-[24rem] flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2 font-coolvetica">{evt.title}</h3>

                  <div className="space-y-2 mb-4 font-dot-matrix tracking-wide text-slate-800">
                    <div className="flex items-center text-slate-600 ">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{evt.date}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{evt.time}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{evt.location}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{evt.organizer}</span>
                    </div>
                  </div>

                  <p className="text-slate-800 text-sm line-clamp-3 font-eloquia-text  font-normal">{evt.description}</p>
                </div>

                <div className="pt-4 mt-auto">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
            View All Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}