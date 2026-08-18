"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Calendar, CalendarDays, 
  MapPin, Trophy, Users, Settings, LogOut,
  Image as ImageIcon, Menu, X
} from "lucide-react";
import { CustomerLogoutButton } from "@/components/customer-logout-button";

export function MobileNav({ userName, userEmail }: { userName: string, userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 max-w-[80vw] h-full bg-background border-r shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/admin" onClick={() => setIsOpen(false)} className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  A
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">AKC Padel</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
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
                      {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
                <CustomerLogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
