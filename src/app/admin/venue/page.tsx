import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVenuePage() {
  const venue = await db.venue.findFirst();

  if (!venue) {
    return <div>No venue configured.</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venue Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your main sports center details and contact info.</p>
        </div>
        <Button>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your venue's primary details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Venue Name</Label>
                <Input defaultValue={venue.name} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={venue.description || ""} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Full Address</Label>
                <div className="flex gap-2">
                  <Input defaultValue={venue.address || ""} />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
              <CardDescription>Set the default open and close times.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Open Time</Label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input defaultValue={venue.openTime} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Close Time</Label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input defaultValue={venue.closeTime} className="pl-9" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input defaultValue={venue.phone || ""} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input defaultValue={venue.email || ""} className="pl-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Venue is Active</h3>
                <p className="text-xs text-muted-foreground mt-1">Customers can view and book courts.</p>
              </div>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-white border-destructive/30">
                Temporarily Close Venue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
