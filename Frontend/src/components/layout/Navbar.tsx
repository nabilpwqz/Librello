"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Avatar, Dropdown } from "@heroui/react";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const links = [
    { label: "Home", path: "/" },
    { label: "Browse Archive", path: "/books" },
  ];

  const dashboardRoutes = {
    user: "/dashboard/user",
    librarian: "/dashboard/librarian",
    admin: "/dashboard/admin",
  };
  const userRole = user?.role || "user";
  const userDashboardPath = dashboardRoutes[userRole] || "/dashboard/user";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully.", {
            position: "top-right",
            autoClose: 2500,
          });
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (!mounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="bg-card/85 backdrop-blur-md border-b border-border transition-all duration-300">
          <div className="container-custom h-16 flex items-center justify-between">
            {/* BRAND LOGO */}
            <LibrelloLogo />

            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden md:flex items-center gap-8 ml-8">
              {links.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Dashboard Dropdown Trigger */}
              {user && (
                <div className="relative py-1">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      pathname?.startsWith("/dashboard")
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dashboard
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full mt-3 right-0 w-56 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-primary block">
                          Active Session
                        </span>
                        <span className="text-xs text-muted-foreground truncate block">
                          {user?.email}
                        </span>
                      </div>

                      <Link
                        href={userDashboardPath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-card-soft transition-colors"
                      >
                        Go to Dashboard ({user?.role || "reader"})
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg border border-border bg-card hover:bg-card-soft flex items-center justify-center text-foreground transition-colors cursor-pointer"
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {isPending && !user && (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-card-soft" />
              )}

              {/* User Dropdown */}
              {!isPending && user && (
                <Dropdown>
                  <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
                    <Avatar className="ring-1 ring-border hover:ring-primary transition-all">
                      <Avatar.Image
                        alt={user?.name || "User Profile"}
                        src={user?.image}
                        referrerPolicy="no-referrer"
                      />
                      <Avatar.Fallback className="bg-primary text-white font-medium text-sm font-serif">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "L"}
                      </Avatar.Fallback>
                    </Avatar>
                  </Dropdown.Trigger>

                  <Dropdown.Popover
                    className="bg-card border border-border rounded-xl min-w-[240px] p-2"
                    style={{ boxShadow: "var(--shadow)" }}
                  >
                    <div className="px-3 pt-2 pb-2.5 border-b border-border mb-1">
                      <p className="text-sm font-serif font-semibold text-foreground truncate">
                        {user?.name || "Member Reader"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Dropdown.Menu className="text-foreground flex flex-col gap-0.5">
                      <Dropdown.Item
                        id="dashboard"
                        textValue="Dashboard"
                        className="p-0 rounded-lg hover:bg-card-soft transition-colors"
                      >
                        <Link
                          href={userDashboardPath}
                          className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-medium text-foreground"
                        >
                          <span>Dashboard Overview</span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        id="profile"
                        textValue="Profile"
                        className="p-0 rounded-lg hover:bg-card-soft transition-colors"
                      >
                        <Link
                          href={`/dashboard/${user.role}/profile`}
                          className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-medium text-foreground"
                        >
                          <span>Account Profile</span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        id="logout"
                        textValue="Logout"
                        className="p-0 mt-2 border-t border-border pt-1.5"
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )}

              {!isPending && !user && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="px-4 py-2 text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary !py-2 !px-4 !text-xs !rounded-lg"
                  >
                    Join Collective
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden h-10 w-10 rounded-lg border border-border bg-card flex items-center justify-center text-foreground cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-[82%] max-w-[320px] z-[100] bg-card border-r border-border flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <LibrelloLogo size="sm" />
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close Menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-5 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-card-soft text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card-soft"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          {user && (
            <Link
              href={userDashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground bg-card-soft font-medium"
            >
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className="p-5 border-t border-border space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card-soft text-xs">
            <span className="text-muted-foreground font-medium">Theme</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-1 rounded bg-card border border-border text-foreground font-medium"
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-center py-2 text-xs font-medium text-red-600 rounded-lg border border-border hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block text-center py-2 text-xs font-medium border border-border rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block text-center py-2 text-xs font-medium btn-primary rounded-lg"
              >
                Join Collective
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
