"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Court {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  pricePerHour: number;
  isIndoor: boolean;
  facilities: string | null;
}

interface Props {
  courts: Court[];
  sportSlug: string;
  venueHours: { open: string; close: string };
}

interface SelectedSlot {
  courtId: string;
  courtName: string;
  date: string;
  time: string;
  price: number;
}

export function CourtListClient({ courts, sportSlug, venueHours }: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/courts/availability?sport=${sportSlug}&date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAvailability();
  }, [selectedDate, sportSlug]);

  const toggleSlot = (court: Court, time: string, dateStr: string) => {
    setSelectedSlots((prev) => {
      const exists = prev.find(s => s.courtId === court.id && s.time === time && s.date === dateStr);
      if (exists) {
        return prev.filter(s => !(s.courtId === court.id && s.time === time && s.date === dateStr));
      } else {
        return [...prev, {
          courtId: court.id,
          courtName: court.name,
          date: dateStr,
          time,
          price: court.pricePerHour
        }];
      }
    });
  };

  const handleCheckout = () => {
    if (selectedSlots.length === 0) return;
    
    const slotsParam = encodeURIComponent(JSON.stringify(selectedSlots));
    router.push(`/booking?slots=${slotsParam}`);
  };

  const totalPrice = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  return (
    <div className="space-y-8 pb-24">
      {/* Date Picker */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {dates.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[80px] h-20 rounded-2xl border transition-all duration-200",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wider">{format(date, "EEE")}</span>
              <span className="text-2xl font-bold mt-1">{format(date, "dd")}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courts.map((court) => (
          <Card key={court.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">{court.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-white dark:bg-slate-800">
                      {court.isIndoor ? "Indoor" : "Outdoor"}
                    </Badge>
                    <Badge variant="outline" className="bg-white dark:bg-slate-800 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {court.capacity} max
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    Rp {court.pricePerHour.toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-muted-foreground">per hour</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground animate-pulse">
                  Loading slots...
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Available Time Slots
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots[court.id]?.slots?.length > 0 ? (
                      availableSlots[court.id].slots.map((slot: any) => {
                        const dateStr = format(selectedDate, "yyyy-MM-dd");
                        const isSelected = selectedSlots.some(s => s.courtId === court.id && s.time === slot.time && s.date === dateStr);
                        
                        return (
                          <Button 
                            key={slot.time} 
                            variant={isSelected ? "default" : (slot.available ? "outline" : "secondary")}
                            className={cn(
                              "h-9 text-xs transition-colors",
                              slot.available && !isSelected && "hover:border-primary hover:text-primary",
                              !slot.available && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!slot.available}
                            onClick={() => toggleSlot(court, slot.time, dateStr)}
                          >
                            {slot.time}
                          </Button>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-4 text-center text-sm text-muted-foreground">
                        {availableSlots[court.id] ? "All slots booked for this date." : "No slots available."}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Checkout Bar */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-10">
          <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">{selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected</p>
                <p className="text-sm text-muted-foreground">Across {new Set(selectedSlots.map(s => s.courtId)).size} court(s)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted-foreground">Total Fee</p>
                <p className="font-bold text-xl text-primary">Rp {totalPrice.toLocaleString('id-ID')}</p>
              </div>
              <Button size="lg" className="w-full sm:w-auto px-8 h-12" onClick={handleCheckout}>
                Book Selected <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
