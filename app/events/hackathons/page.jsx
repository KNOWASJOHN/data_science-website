"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/image-carousel";
import { Calendar, Clock, MapPin, Users, Trophy, Code, Zap, ArrowRight } from "lucide-react";
import { database } from "@/app/database/firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function HackathonsPage() {
  const [ongoingHackathons, setOngoingHackathons] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [pastHackathons, setPastHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Starting Firebase connection...");
    try {
      // Reference to each category in the database
      const ongoingRef = ref(database, "hackathons/ongoing");
      const upcomingRef = ref(database, "hackathons/upcoming");
      const pastRef = ref(database, "hackathons/past");

      // Fetch ongoing hackathons
      onValue(ongoingRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const hackathonsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            status: "ongoing"
          }));
          setOngoingHackathons(hackathonsArray);
        } else {
          setOngoingHackathons([]);
        }
      });

      // Fetch upcoming hackathons
      onValue(upcomingRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const hackathonsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            status: "upcoming"
          }));
          setUpcomingHackathons(hackathonsArray);
        } else {
          setUpcomingHackathons([]);
        }
      });

      // Fetch past hackathons
      onValue(pastRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const hackathonsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            status: "completed"
          }));
          setPastHackathons(hackathonsArray);
        } else {
          setPastHackathons([]);
        }
        setLoading(false); // Set loading to false after all data is fetched
      }, (error) => {
        console.error("Firebase error:", error);
        setError(error.message);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error setting up Firebase:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const currentDate = new Date();

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Process hackathon data to ensure all required fields exist and match database structure
  const processHackathon = (hackathon) => {
    return {
      ...hackathon,
      title: hackathon.title || "Untitled Hackathon",
      description: hackathon.description || "",
      startDate: hackathon.startDate || "",
      endDate: hackathon.endDate || "",
      date: formatDate(hackathon.startDate),
      location: hackathon.location || "TBA",
      participants: hackathon.participants || 0,
      prizes: hackathon.prizes || "TBA",
      featured: hackathon.featured || false,
      themes: Array.isArray(hackathon.themes) ? hackathon.themes : [],
      images: Array.isArray(hackathon.images) ? hackathon.images : ["/placeholder.svg"],
      time: hackathon.time || "9:00 AM - 6:00 PM",
      sponsors: Array.isArray(hackathon.sponsors) ? hackathon.sponsors : [],
    };
  };

  // Process hackathons from each category
  const processedOngoingHackathons = ongoingHackathons.map(processHackathon);
  const processedUpcomingHackathons = upcomingHackathons.map(processHackathon);
  const processedPastHackathons = pastHackathons.map(processHackathon);

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-slate-600">Loading hackathons...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-2">Error loading hackathons</p>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loading && ongoingHackathons.length === 0 && upcomingHackathons.length === 0 && pastHackathons.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl text-slate-600">No hackathons found. Check back later!</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <div className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Hackathons</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Join our exciting hackathons and coding challenges to showcase your skills and build innovative solutions
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: "8+", label: "Hackathons Organized" },
              { value: "500+", label: "Total Participants" },
              { value: "₹10L+", label: "Prize Money Distributed" },
              { value: "50+", label: "Industry Partners" }
            ].map((stat, index) => (
              <div key={`stat-${index}`} className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Ongoing Hackathons */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Ongoing Hackathons</h2>
            <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
              <Zap className="h-4 w-4 mr-1" />
              In Progress
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedOngoingHackathons.map((hackathon, index) => (
              <Card
                key={hackathon.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48">
                  <ImageCarousel images={hackathon.images} alt={hackathon.title} className="h-full" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Ongoing
                    </Badge>
                  </div>
                  {hackathon.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-cyan-600 hover:bg-cyan-700">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 line-clamp-2">{hackathon.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Start: {formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">End: {formatDate(hackathon.endDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.time}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.location}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.participants} participants</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Trophy className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Prize Pool: {hackathon.prizes}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{hackathon.description}</p>

                  {hackathon.sponsors && hackathon.sponsors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Sponsors:</h4>
                      <div className="flex flex-wrap gap-1">
                        {hackathon.sponsors.slice(0, 3).map((sponsor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center">
                            {sponsor.logo && (
                              <img 
                                src={sponsor.logo} 
                                alt={`${sponsor.name} logo`} 
                                className="w-4 h-4 mr-1"
                              />
                            )}
                            {sponsor.name}
                          </Badge>
                        ))}
                        {hackathon.sponsors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hackathon.sponsors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    View Live Updates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {ongoingHackathons.length === 0 && (
            <div className="text-center text-slate-600 py-8">
              No hackathons are currently in progress.
            </div>
          )}
        </section>

        {/* Upcoming Hackathons */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Upcoming Hackathons</h2>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Zap className="h-4 w-4 mr-1" />
              Register Now
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedUpcomingHackathons.map((hackathon, index) => (
              <Card
                key={hackathon.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48">
                  <ImageCarousel images={hackathon.images} alt={hackathon.title} className="h-full" />
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status === "upcoming" ? "Upcoming" : "Completed"}
                    </Badge>
                  </div>
                  {hackathon.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-cyan-600 hover:bg-cyan-700">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 line-clamp-2">{hackathon.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Start: {formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">End: {formatDate(hackathon.endDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.time}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.location}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.participants} participants expected</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Trophy className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Prize Pool: {hackathon.prizes}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{hackathon.description}</p>

                  {hackathon.sponsors && hackathon.sponsors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Sponsors:</h4>
                      <div className="flex flex-wrap gap-1">
                        {hackathon.sponsors.slice(0, 3).map((sponsor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center">
                            {sponsor.logo && (
                              <img 
                                src={sponsor.logo} 
                                alt={`${sponsor.name} logo`} 
                                className="w-4 h-4 mr-1"
                              />
                            )}
                            {sponsor.name}
                          </Badge>
                        ))}
                        {hackathon.sponsors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hackathon.sponsors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Themes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.themes.slice(0, 3).map((theme, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {theme}
                        </Badge>
                      ))}
                      {hackathon.themes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hackathon.themes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Hackathons */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Past Hackathons</h2>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              <Trophy className="h-4 w-4 mr-1" />
              Success Stories
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedPastHackathons.map((hackathon, index) => (
              <Card
                key={hackathon.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48">
                  <ImageCarousel images={hackathon.images} alt={hackathon.title} className="h-full" />
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(hackathon.status)}>Completed</Badge>
                  </div>
                  {hackathon.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-amber-600 hover:bg-amber-700">Flagship Event</Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 line-clamp-2">{hackathon.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Start: {formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">End: {formatDate(hackathon.endDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">{hackathon.participants} participants</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Trophy className="h-4 w-4 mr-2 text-cyan-600" />
                      <span className="text-sm">Prize Pool: {hackathon.prizes}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{hackathon.description}</p>

                  {hackathon.sponsors && hackathon.sponsors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Sponsors:</h4>
                      <div className="flex flex-wrap gap-1">
                        {hackathon.sponsors.slice(0, 3).map((sponsor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center">
                            {sponsor.logo && (
                              <img 
                                src={sponsor.logo} 
                                alt={`${sponsor.name} logo`} 
                                className="w-4 h-4 mr-1"
                              />
                            )}
                            {sponsor.name}
                          </Badge>
                        ))}
                        {hackathon.sponsors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hackathon.sponsors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {hackathon.winner && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="text-sm font-semibold text-amber-800 mb-1">🏆 Winner:</h4>
                      <p className="text-sm text-amber-700">{hackathon.winner}</p>
                    </div>
                  )}

                  <Button variant="outline" className="w-full bg-transparent">
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Participate Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Participate in Our Hackathons?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Skill Development</h3>
              <p className="text-slate-600 text-sm">Enhance your coding, problem-solving, and teamwork skills</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Networking</h3>
              <p className="text-slate-600 text-sm">Connect with industry experts, mentors, and like-minded peers</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Win Prizes</h3>
              <p className="text-slate-600 text-sm">Compete for substantial cash prizes and recognition</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Innovation</h3>
              <p className="text-slate-600 text-sm">Work on cutting-edge technologies and real-world problems</p>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
