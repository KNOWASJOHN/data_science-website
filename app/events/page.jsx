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

{featuredEvents.map((evt) => (
  <Image
    src={evt.images?.[0] || "/placeholder.svg?height=300&width=600"}
    alt={evt.title || "Event Image"}
    width={600}
    height={300}
    style={{ objectFit: "cover" }}
  />
))}


  const categoryColors = {
    Workshop: "bg-blue-100 text-blue-800",
    Conference: "bg-cyan-100 text-cyan-800",
    Hackathon: "bg-red-100 text-red-800",
    "Guest Lecture": "bg-green-100 text-green-800",
    Festival: "bg-orange-100 text-orange-800",
    Networking: "bg-purple-100 text-purple-800"
  };

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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((evt,index) => (
            <Card
  key={evt.id}
  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up flex flex-col"
  style={{ animationDelay: `${index * 100}ms` }}
>
  <div className="relative h-48 flex-shrink-0">
    <ImageCarousel
      images={evt.images || ["/placeholder.svg?height=300&width=600"]}
      alt={evt.title}
      className="h-full w-full object-cover"
    />
    <div className="absolute top-3 right-3">
      <Badge className={categoryColors[evt.category] || "bg-slate-100 text-slate-800"}>
        {evt.category}
      </Badge>
    </div>
    {evt.featured && (
      <div className="absolute top-3 left-3">
        <Badge className="bg-cyan-600 hover:bg-cyan-700">Featured</Badge>
      </div>
    )}
  </div>

  <CardContent className="p-6 flex flex-col flex-grow">
    <h3 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">{evt.title}</h3>

    <div className="space-y-2 mb-4">
      <div className="flex items-center text-slate-600">
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

    <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{evt.description}</p>

    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 mt-auto">
      View Details
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </CardContent>
</Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
