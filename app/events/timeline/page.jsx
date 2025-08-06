"use client"

import { useState, useEffect } from "react"
import { database } from "@/app/database/firebaseConfig"
import { ref, onValue } from "firebase/database"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCalendar } from "@/components/event-calendar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Calendar, Clock, MapPin, Users } from "lucide-react"

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Fetch events from Firebase
  useEffect(() => {
    const eventsRef = ref(database, "events/")

    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            // Convert Firebase data to array and parse dates
            const eventsArray = Object.entries(data).map(([key, event]) => {
              console.log('Event data:', event); // Debug log
              return {
                ...event,
                id: key,
                date: new Date(event.date),
                endDate: event.endDate ? new Date(event.endDate) : null,
              };
            })

            // Sort events by date
            const sortedEvents = eventsArray.sort((a, b) => a.date - b.date)

            setAllEvents(sortedEvents)
            setFilteredEvents(sortedEvents)
          } else {
            setAllEvents([])
            setFilteredEvents([])
          }
          setLoading(false)
        } catch (error) {
          console.error("Error fetching events:", error)
          setError(error)
          setLoading(false)
        }
      },
      (error) => {
        console.error("Error fetching events:", error)
        setError(error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Handle search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(allEvents)
      setSearchPerformed(false)
      setShowSearchResults(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query),
    )
    setFilteredEvents(filtered)
    setSearchPerformed(true)
    setShowSearchResults(true)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setFilteredEvents(allEvents)
    setSearchPerformed(false)
    setShowSearchResults(false)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Category colors for badges
  const categoryColors = {
    Workshop: "bg-blue-100 text-blue-800",
    "Guest Lecture": "bg-green-100 text-green-800",
    Training: "bg-purple-100 text-purple-800",
    Contest: "bg-amber-100 text-amber-800",
    Conference: "bg-cyan-100 text-cyan-800",
    "Industry Visit": "bg-indigo-100 text-indigo-800",
    Hackathon: "bg-red-100 text-red-800",
    Orientation: "bg-teal-100 text-teal-800",
    Meeting: "bg-gray-100 text-gray-800",
    Networking: "bg-pink-100 text-pink-800",
    Festival: "bg-orange-100 text-orange-800",
    Celebration: "bg-rose-100 text-rose-800",
    Exhibition: "bg-emerald-100 text-emerald-800",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 font-coolvetica">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">Error loading events</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 animate-slide-up font-mirage">
            Events Timeline
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl animate-slide-up animation-delay-200 font-creato-thin">
            Explore our upcoming and past events in an interactive calendar view
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-400 font-coolvetica">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search events by title, category, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-slate-300 pr-10 transition-all duration-300 focus:ring-2 focus:ring-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className="bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 hover:scale-105"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Search Results Summary */}
          {searchPerformed && (
            <div className="mt-4 flex items-center justify-between animate-fade-in">
              <div className="text-sm text-slate-600">
                Found {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"} matching "
                <span className="font-medium">{searchQuery}</span>"
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>

        {/* Show Search Results as Cards when searching */}
        {showSearchResults && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Search Results
            </h2>
            {filteredEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                                      <Card
                    key={event.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-up"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-48">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <div className="text-slate-400 text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">No image available</p>
                          </div>
                        </div>
                      )}
                      {event.featured && (
                        <Badge className="absolute top-2 right-2 bg-cyan-600 hover:bg-cyan-700 animate-pulse font-creato-thin tracking-wide">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <CardHeader>
                        <div className="mb-2 text-lg font-creato-thin tracking-wide">
                          <Badge
                            className={
                              categoryColors[event.category] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl text-slate-800 line-clamp-2 font-bold font-mirage tracking-wide">
                          {event.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center text-slate-600 font-creato-bl">
                            <Calendar className="h-5 w-5 mr-3 text-cyan-500" />
                            <span className="text-sm">
                              {event.date.toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                              {event.endDate && (
                                <span>
                                  {" - "}
                                  {event.endDate.toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Clock className="h-5 w-5 mr-3 text-cyan-600" />
                            <span className="text-sm font-creato-bl">{event.time}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <MapPin className="h-5 w-5 mr-3 text-cyan-600" />
                            <span className="text-sm font-creato-bl">{event.location}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Users className="h-5 w-5 mr-3 text-cyan-600" />
                            <span className="text-sm font-creato-bl">{event.organizer}</span>
                          </div>
                        </div>
                        <p className="text-slate-800 text-base leading-relaxed line-clamp-3 mb-6 font-creato-thin">
                          {event.description}
                        </p>
                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 hover:scale-105 font-eloquia-text"
                          onClick={() => window.location.href = `/events/${event.id}`}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No events found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search terms or browse all events below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Calendar */}
        <div className="animate-slide-up animation-delay-600">
          <EventCalendar events={filteredEvents} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
