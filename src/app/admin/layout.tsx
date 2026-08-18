import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { 
  LayoutDashboard, Calendar, CalendarDays, 
  MapPin, Trophy, Users, Settings, LogOut,
  Image as ImageIcon
} from "lucide-react";
import { CustomerLogoutButton } from "@/components/customer-logout-button";
import { MobileNav } from "./mobile-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, section: "Overview" },
    
    { name: "Calendar", href: "/admin/calendar", icon: Calendar, section: "Booking" },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays, section: "Booking" },
    { name: "Customers", href: "/admin/customers", icon: Users, section: "Booking" },
    
    { name: "Venue Profile", href: "/admin/venue", icon: MapPin, section: "Venue" },
    { name: "Sports and Court", href: "/admin/sports", icon: Trophy, section: "Venue" },
    
    { name: "Events", href: "/admin/events", icon: CalendarDays, section: "Community" },
    { name: "Articles", href: "/admin/articles", icon: ImageIcon, section: "Community" },
    { name: "Highlights", href: "/admin/highlights", icon: ImageIcon, section: "Community" },
    
    { name: "Settings", href: "/admin/settings", icon: Settings, section: "Settings" },
  ];

  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-lg">
              S
            </span>
            AKC Padel Admin
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="space-y-8">
            {Object.entries(groupedNav).map(([section, items]) => (
              <div key={section}>
                {section !== "Overview" && (
                  <h4 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section}
                  </h4>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {session.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{session.email}</p>
            </div>
            <CustomerLogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background md:hidden">
          <Link href="/admin" className="font-bold text-xl text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">S</span>
            AKC Padel Admin
          </Link>
          <MobileNav userName={session.name} userEmail={session.email} />
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
