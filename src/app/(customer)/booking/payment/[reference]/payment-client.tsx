"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CreditCard, Smartphone, Wallet, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PaymentMethod } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
  booking: any;
}

export function PaymentClient({ booking }: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const paymentOptions = [
    { id: PaymentMethod.QRIS, label: "QRIS", icon: Smartphone, desc: "Pay with GoPay, OVO, Dana, LinkAja" },
    { id: PaymentMethod.BANK_TRANSFER, label: "Virtual Account", icon: Building2, desc: "BCA, Mandiri, BNI, BRI" },
    { id: PaymentMethod.CREDIT_CARD, label: "Credit Card", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
    { id: PaymentMethod.EWALLET, label: "E-Wallet", icon: Wallet, desc: "ShopeePay, OVO" },
  ];

  const handlePayment = async () => {
    if (!method) return;
    setLoading(true);

    try {
      const res = await fetch("/api/bookings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: booking.reference,
          paymentMethod: method,
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Payment failed simulation");
        setLoading(false);
      }
    } catch (err) {
      alert("Error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center shadow-lg border-primary/20 bg-primary/5">
        <CardContent className="pt-12 pb-12 flex flex-col items-center">
          <CheckCircle2 className="w-20 h-20 text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Payment Successful!</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Your booking is confirmed. We've sent the details and QR code ticket to <strong>{booking.guestEmail}</strong>.
          </p>
          <Button size="lg" className="w-full sm:w-auto h-12 px-8" onClick={() => router.push(`/booking/ticket/${booking.reference}`)}>
            View Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              {booking.reference}
            </span>
          </div>
          <div className="flex items-center justify-between font-bold text-xl pt-4 border-t">
            <span>Total Payment</span>
            <span className="text-primary">Rp {booking.totalAmount.toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Select Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMethod(opt.id)}
              className={cn(
                "flex flex-col items-start p-4 border rounded-xl transition-all duration-200 text-left w-full",
                method === opt.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                  : "border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-white dark:bg-slate-900"
              )}
            >
              <opt.icon className={cn("w-6 h-6 mb-3", method === opt.id ? "text-primary" : "text-slate-500")} />
              <span className="font-semibold">{opt.label}</span>
              <span className="text-xs text-muted-foreground mt-1">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <Button 
        size="lg" 
        className="w-full h-14 text-lg mt-8 shadow-xl shadow-primary/20" 
        disabled={!method || loading}
        onClick={handlePayment}
      >
        {loading ? "Processing..." : `Pay Rp ${booking.totalAmount.toLocaleString('id-ID')}`}
      </Button>
    </div>
  );
}
