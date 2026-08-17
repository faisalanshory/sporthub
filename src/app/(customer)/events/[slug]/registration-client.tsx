"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, CreditCard, Wallet, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  eventId: string;
  isPrivate: boolean;
  isRegistered: boolean;
  isFull: boolean;
  isPast: boolean;
  isLoggedIn: boolean;
  fee: number;
}

export function RegistrationClient({ eventId, isPrivate, isRegistered, isFull, isPast, isLoggedIn, fee }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [privateCode, setPrivateCode] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");

  const initiateRegistration = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isPrivate && !privateCode) {
      setShowCodeModal(true);
      return;
    }

    if (fee > 0) {
      setShowCodeModal(false);
      setShowPaymentModal(true);
      return;
    }

    executeRegistration();
  };

  const handleCodeSubmit = () => {
    if (!privateCode) return;
    if (fee > 0) {
      setShowCodeModal(false);
      setShowPaymentModal(true);
    } else {
      executeRegistration();
    }
  };

  const executeRegistration = async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate payment delay if paying
      if (fee > 0) {
        await new Promise(r => setTimeout(r, 1500));
      }

      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, privateCode })
      });

      if (res.ok) {
        setSuccess(true);
        setShowCodeModal(false);
        setShowPaymentModal(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to register.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (isPast) {
    return <Button size="lg" className="w-full h-14 text-lg" disabled>Event has Ended</Button>;
  }

  if (isRegistered || success) {
    return (
      <Button size="lg" variant="outline" className="w-full h-14 text-lg border-emerald-500 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" disabled>
        <CheckCircle2 className="w-5 h-5 mr-2" /> You are Registered
      </Button>
    );
  }

  if (isFull) {
    return <Button size="lg" variant="secondary" className="w-full h-14 text-lg" disabled>Quota Full</Button>;
  }

  return (
    <>
      <Button size="lg" className="w-full h-14 text-lg shadow-xl shadow-primary/20" onClick={initiateRegistration} disabled={loading}>
        {loading ? "Processing..." : (fee > 0 ? "Register & Pay" : "Register Now")}
      </Button>

      {error && !showCodeModal && !showPaymentModal && (
        <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Private Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Private Event</DialogTitle>
            <DialogDescription>
              This event is private. Please enter the invitation code to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Invitation Code</Label>
              <Input 
                placeholder="Enter code..." 
                value={privateCode}
                onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCodeModal(false)}>Cancel</Button>
            <Button onClick={handleCodeSubmit} disabled={!privateCode}>
              {fee > 0 ? "Continue to Payment" : "Join Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Registration</DialogTitle>
            <DialogDescription>
              Select a payment method to pay the registration fee of Rp {fee.toLocaleString('id-ID')}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  paymentMethod === 'qris' 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-500"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">QRIS</span>
                </div>
                <span className="text-sm font-medium">QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  paymentMethod === 'transfer' 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-500"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                  paymentMethod === 'card' 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-slate-200 dark:border-slate-800 hover:border-primary/50 text-slate-500"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Card</span>
              </button>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)} disabled={loading}>Cancel</Button>
            <Button onClick={executeRegistration} disabled={loading}>
              {loading ? "Processing Payment..." : `Pay Rp ${fee.toLocaleString('id-ID')}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
