"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";

export function AddSportClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [numCourts, setNumCourts] = useState("1");

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, numCourts })
      });
      
      if (!res.ok) throw new Error("Failed to add sport");
      
      setOpen(false);
      setName("");
      setIcon("");
      setNumCourts("1");
      router.refresh();
    } catch (error) {
      alert("Error adding sport");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Sport
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sport</DialogTitle>
            <DialogDescription>
              Create a new sport category for your venues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sport Name</Label>
              <Input 
                placeholder="e.g. Basketball" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (Emoji or SVG string)</Label>
              <Input 
                placeholder="🏀" 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Courts</Label>
              <Input 
                type="number"
                min="1"
                placeholder="How many courts to generate?" 
                value={numCourts}
                onChange={(e) => setNumCourts(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">The system will automatically generate court records for this sport.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name || loading}>
              {loading ? "Saving..." : "Save Sport"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
