"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddArticleClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, coverImage })
      });
      
      if (!res.ok) throw new Error("Failed to add article");
      
      setOpen(false);
      setTitle("");
      setContent("");
      router.refresh();
    } catch (error) {
      alert("Error creating article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Write Article
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write New Article</DialogTitle>
            <DialogDescription>
              Publish a new blog post. A default cover image will be assigned for this demo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Article Title</Label>
              <Input 
                placeholder="e.g. 5 Tips for Better Serves" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL (Optional)</Label>
              <Input 
                placeholder="https://images.unsplash.com/..." 
                value={coverImage} 
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                placeholder="Write your article content here..." 
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!title || !content || loading}>
              {loading ? "Publishing..." : "Publish Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
