"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "@/hooks/use-app-state";

interface NavigationItem {
  href: string;
  label: string;
}

interface AppShellProps {
  sidebarTitle: string;
  heading: string;
  navigation: NavigationItem[];
  children: ReactNode;
}

/**
 * Renders the shared dashboard frame used by both user and admin pages.
 */
export function AppShell({
  sidebarTitle,
  heading,
  navigation,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAppState();

  /**
   * Logs out via mock store and sends the user back to the login route.
   */
  function handleLogout(): void {
    logout();
    router.push("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-title">{sidebarTitle}</div>
        <nav className="sidebar-nav" aria-label="Sidebar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="content-panel">
        <header className="content-header">
          <h1>{heading}</h1>
          <div className="header-controls">
            <span className="header-user">{currentUser?.name ?? "guest"}</span>
            <button type="button" className="button secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </section>
    </div>
  );
}
