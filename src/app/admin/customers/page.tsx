import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true, eventRegistrations: true }
      }
    }
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage registered users and view their activity.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Contact Info</TableHead>
                  <TableHead className="font-semibold text-center">Court Bookings</TableHead>
                  <TableHead className="font-semibold text-center">Events Joined</TableHead>
                  <TableHead className="text-right font-semibold">Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium">{customer.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" /> {customer.phone || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono">{customer._count.bookings}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-mono">{customer._count.eventRegistrations}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {format(customer.createdAt, "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
