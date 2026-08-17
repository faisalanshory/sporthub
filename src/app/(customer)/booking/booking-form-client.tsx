"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle, Trash2, SwitchCamera, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SelectedSlot {
  courtId: string;
  courtName: string;
  date: string;
  time: string;
  price: number;
}

interface Props {
  slots: SelectedSlot[];
  user: { name: string; email: string } | null;
}

export function BookingFormClient({ slots: initialSlots, user }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState<SelectedSlot[]>(initialSlots);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Standard booking data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    notes: ""
  });

  // Event creation data
  const [createEvent, setCreateEvent] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    isPrivate: false,
    privateCode: "",
    maxParticipants: 10,
    fee: 0,
    coverImage: ""
  });

  const courtFee = slots.reduce((sum, s) => sum + s.price, 0);
  const serviceFee = 5000;
  const totalAmount = courtFee + serviceFee;

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  // Check if eligible to create an event (>= 3 consecutive hours on the same court/date)
  const isEligibleForEvent = useMemo(() => {
    if (!user) return false; // Must be logged in

    const grouped: Record<string, number[]> = {};
    for (const slot of slots) {
      const key = `${slot.courtId}_${slot.date}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(parseInt(slot.time.split(":")[0]));
    }

    for (const key in grouped) {
      const hours = grouped[key].sort((a, b) => a - b);
      let maxConsecutive = 1;
      let currentConsecutive = 1;
      for (let i = 1; i < hours.length; i++) {
        if (hours[i] === hours[i - 1] + 1) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else if (hours[i] !== hours[i - 1]) {
          currentConsecutive = 1;
        }
      }
      if (maxConsecutive >= 3) return true;
    }
    return false;
  }, [slots, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slots.length === 0) {
      setError("No slots selected.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const payload: any = {
        slots,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        notes: formData.notes
      };

      if (createEvent && isEligibleForEvent) {
        payload.event = eventData;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/booking/payment/${data.reference}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create booking.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">No slots selected</h2>
        <Button onClick={() => router.push("/sports")}>Browse Courts</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <CardTitle>Player Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {user ? (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm mb-4">
                  You are booking as <span className="font-semibold text-primary">{user.name}</span> ({user.email}).
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  required
                  placeholder="+62 8..."
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {isEligibleForEvent && (
            <Card className="shadow-sm border-primary/20 bg-primary/5 overflow-hidden">
              <CardHeader className="border-b border-primary/10 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      Host an Event <Badge variant="secondary" className="bg-primary/20 text-primary">Pro</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      You booked 3+ consecutive hours! You can turn this booking into a public or private event.
                    </p>
                  </div>
                  <Switch checked={createEvent} onCheckedChange={setCreateEvent} />
                </div>
              </CardHeader>
              
              {createEvent && (
                <CardContent className="p-6 space-y-4 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input 
                      required={createEvent}
                      placeholder="e.g. Turnamen Futsal Antar Divisi"
                      value={eventData.title}
                      onChange={(e) => setEventData({...eventData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Tell people what this event is about..."
                      value={eventData.description}
                      onChange={(e) => setEventData({...eventData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quota (Max Participants)</Label>
                      <Input 
                        type="number"
                        min={2}
                        required={createEvent}
                        value={eventData.maxParticipants}
                        onChange={(e) => setEventData({...eventData, maxParticipants: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Join Fee (Rp) - 0 for Free</Label>
                      <Input 
                        type="number"
                        min={0}
                        required={createEvent}
                        value={eventData.fee}
                        onChange={(e) => setEventData({...eventData, fee: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border">
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> Private Event
                      </span>
                      <span className="text-xs text-muted-foreground">Only people with the code can join.</span>
                    </div>
                    <Switch checked={eventData.isPrivate} onCheckedChange={(v) => setEventData({...eventData, isPrivate: v})} />
                  </div>

                  {eventData.isPrivate && (
                    <div className="space-y-2">
                      <Label>Private Code</Label>
                      <Input 
                        required={eventData.isPrivate}
                        placeholder="e.g. SECRET123"
                        value={eventData.privateCode}
                        onChange={(e) => setEventData({...eventData, privateCode: e.target.value.toUpperCase()})}
                      />
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}

          {error && (
            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={loading}>
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </form>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
              {slots.map((slot, i) => {
                const startHour = parseInt(slot.time.split(":")[0]);
                const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`;
                return (
                  <div key={i} className="flex justify-between items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-semibold text-sm">{slot.courtName}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(slot.date), "dd MMM")}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {slot.time} - {endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-primary">Rp {slot.price.toLocaleString('id-ID')}</p>
                      <button onClick={() => removeSlot(i)} className="text-xs text-destructive flex items-center justify-end mt-1 hover:underline">
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Court Fees ({slots.length})</span>
                <span>Rp {courtFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between font-bold pt-3 border-t text-lg text-primary">
                <span>Total</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
