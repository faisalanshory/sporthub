"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  court: any;
  venue: any;
  date: string;
  time: string;
  user: { name: string; email: string } | null;
}

export function BookingFormClient({ court, venue, date, time, user }: Props) {
  const router = useRouter();
  
  // Calculate End Time (Assuming 1 hour duration for MVP)
  const durationHours = 1;
  const startHour = parseInt(time.split(":")[0]);
  const endTime = `${(startHour + durationHours).toString().padStart(2, "0")}:00`;
  
  const courtFee = court.pricePerHour * durationHours;
  const serviceFee = 5000;
  const totalAmount = courtFee + serviceFee;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId: court.id,
          date,
          startTime: time,
          endTime,
          durationHours,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          notes: formData.notes
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to payment simulation page
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm border-slate-200 dark:border-slate-800 mb-6">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
              <CardTitle>Player Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {user ? (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm mb-4">
                  You are booking as <span className="font-semibold text-primary">{user.name}</span> ({user.email}).
                </div>
              ) : (
                <>
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
                </>
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

          {error && (
            <div className="p-4 mb-6 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2">
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
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg">{court.name}</h3>
              <p className="text-muted-foreground text-sm flex items-start gap-1 mt-1">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{venue.name}<br/>{venue.address}</span>
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </div>
                <div className="font-medium">{format(new Date(date), "dd MMMM yyyy")}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground gap-2">
                  <Clock className="w-4 h-4" /> Time
                </div>
                <div className="font-medium">{time} - {endTime}</div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Court Fee (1 hr)</span>
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
