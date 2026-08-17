import * as React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { LayoutDashboard, LogIn, Menu, User, CalendarDays } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { CustomerLogoutButton } from "@/components/customer-logout-button";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoggedIn = !!session;
  const isAdmin = session?.role === UserRole.ADMIN;

  const NavLinks = () => (
    <>
      <Link href="/sports" className="text-sm font-medium hover:text-primary transition-colors">
        Sports
      </Link>
      <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
        Events
      </Link>
      <Link href="/articles" className="text-sm font-medium hover:text-primary transition-colors">
        Articles
      </Link>
      <Link href="/highlights" className="text-sm font-medium hover:text-primary transition-colors">
        Highlights
      </Link>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-lg">
                S
              </span>
              SportHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:flex")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                  </Link>
                )}
                {!isAdmin && (
                  <Link href="/profile" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:flex")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Link>
                )}
                <CustomerLogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}>
                  Log in
                </Link>
                <Link href="/sports" className={cn(buttonVariants({ size: "sm" }), "shadow-sm")}>
                  <CalendarDays className="w-4 h-4 mr-2" /> Book Now
                </Link>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                  <NavLinks />
                  <div className="h-px bg-border my-2" />
                  {isLoggedIn ? (
                    <>
                      {isAdmin ? (
                        <Link href="/admin" className="text-sm font-medium hover:text-primary">Admin Panel</Link>
                      ) : (
                        <Link href="/profile" className="text-sm font-medium hover:text-primary">My Profile</Link>
                      )}
                    </>
                  ) : (
                    <Link href="/login" className="text-sm font-medium hover:text-primary">Log in</Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <span className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  S
                </span>
                SportHub
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The premium destination for your sporting activities. Book courts effortlessly, join communities, and play more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sports" className="hover:text-primary">Sports & Courts</Link></li>
                <li><Link href="/events" className="hover:text-primary">Upcoming Events</Link></li>
                <li><Link href="/articles" className="hover:text-primary">Articles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>hello@sporthub.demo</li>
                <li>+62 811 2233 4455</li>
                <li>Jl. Sudirman No. 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SportHub. All rights reserved.</p>
            <p>Designed for athletes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
