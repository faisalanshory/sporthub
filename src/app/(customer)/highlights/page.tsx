"use client";

import { useState } from "react";
import { Search, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
    },
    {
      id: "vid-2",
      title: "Smash Winner Game 2",
      duration: "0:12",
      matchCode: matchCode || "BKG-A1B2",
      date: "25 Aug 2024",
    },
    {
      id: "vid-3",
      title: "Match Point",
      duration: "1:05",
      matchCode: matchCode || "BKG-A1B2",
      date: "25 Aug 2024",
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
                {/*
                  Crop 8% atas & 8% bawah (watermark area):
                  - Container tinggi = 84% dari aspect-ratio 16:9 (56.25% * 0.84)
                  - Video height = 119.05% (100/84*100) → video lebih tinggi dari container
                  - Video top = -9.52% (8/84*100) → geser ke atas agar 8% atas terpotong
                  - overflow:hidden → 8% atas dan 8% bawah tidak terlihat
                */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "calc(56.25% * 0.84)",
                    overflow: "hidden",
                    backgroundColor: "#0f172a",
                  }}
                >
                  <video
                    src="/vid.mp4"
                    controls
                    playsInline
                    style={{
                      position: "absolute",
                      top: "-9.52%",
                      left: 0,
                      width: "100%",
                      height: "119.05%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{ pointerEvents: "none" }}
                    className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
                  >
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
            <p>Highlight clips dari pertandingan Anda — watermark dipotong otomatis.</p>
          </div>
        </div>
      )}
    </div>
  );
}
