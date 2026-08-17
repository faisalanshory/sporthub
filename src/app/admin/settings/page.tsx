import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure global application behavior.</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Control the availability of the customer-facing portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  If enabled, customers will see a "Down for maintenance" screen. Admin access remains open.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Pause New Bookings</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent any new court reservations temporarily.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Rules</CardTitle>
            <CardDescription>Set restrictions and requirements for reservations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Require Account Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Force users to log in before they can book a court (Disables Guest Checkout).
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Confirm Paid Bookings</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically mark bookings as CONFIRMED once payment is verified.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
