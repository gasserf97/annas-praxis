"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PRACTICE } from "@/lib/practice";
import { cn } from "cn";

const links = [
  { href: "/", label: "Übersicht" },
  { href: "/kunden", label: "Kunden" },
  { href: "/kalender", label: "Kalender" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="grid gap-1">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-medium",
              active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Zum Inhalt
      </a>
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 md:flex">
        <Mark />
        <p className="mt-3 px-1 text-sm text-muted-foreground">
          {PRACTICE.practitioner}
          <span className="block">{PRACTICE.role}</span>
        </p>
        <div className="mt-8">
          <NavLinks pathname={pathname} />
        </div>
        <form action={logout} className="mt-auto">
          <Button type="submit" variant="ghost" className="w-full justify-start px-3">
            Abmelden
          </Button>
        </form>
      </aside>
      <div>
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <Mark />
          <Button type="button" variant="outline" size="icon" className="bg-card" aria-label="Menü öffnen" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </header>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-72 bg-sidebar">
            <SheetHeader>
              <SheetTitle>
                <Mark />
              </SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
              <form action={logout} className="mt-6">
                <Button type="submit" variant="outline" className="w-full bg-card">
                  Abmelden
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
        <main id="inhalt" className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
