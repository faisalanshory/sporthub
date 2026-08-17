"use client";

import { useState } from "react";
import { Search, PlayCircle, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HighlightsPage() {
  const [matchCode, setMatchCode] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchCode.trim()) {
      setSearched(true);
    }
  };

  // Dummy highlights data
  const highlights = [
    {
      id: "vid-1",
      title: "Rally Point Game 1",
      duration: "0:45",
      matchCode: matchCode || "BKG-A1B2",
      date: "25 Aug 2024",
      thumbnail: "bg-slate-800",
    },
    {
      id: "vid-2",
      title: "Smash Winner Game 2",
      duration: "0:12",
      matchCode: matchCode || "BKG-A1B2",
      date: "25 Aug 2024",
      thumbnail: "bg-slate-700",
    },
    {
      id: "vid-3",
      title: "Match Point",
      duration: "1:05",
      matchCode: matchCode || "BKG-A1B2",
      date: "25 Aug 2024",
      thumbnail: "bg-slate-900",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Match Highlights</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Enter your Match Code or Booking Reference to view the AI-recorded highlights of your game.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="max-w-xl mx-auto mb-16 shadow-lg border-primary/10">
        <CardContent className="p-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
            <Input 
              placeholder="e.g. BKG-A1B2" 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-lg"
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
            />
            <Button type="submit" size="lg" className="h-12 px-8">
              Find Highlights
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Highlights for: <span className="text-primary">{matchCode}</span></h2>
            <Badge variant="outline" className="text-sm px-3 py-1 bg-white dark:bg-slate-900">
              3 Clips Found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((clip) => (
              <Card key={clip.id} className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
                {/* Dummy Video Player Area */}
                <div className={`relative aspect-video ${clip.thumbnail} flex items-center justify-center cursor-not-allowed group-hover:opacity-90 transition-opacity`}>
                  <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-white/80 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono">
                    {clip.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    AI Tracking Active
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2 truncate" title={clip.title}>{clip.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {clip.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {clip.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl text-center text-sm text-muted-foreground">
            <p>Note: Video playback is disabled in this demo version.</p>
          </div>
        </div>
      )}
    </div>
  );
}
