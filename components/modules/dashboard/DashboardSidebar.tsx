"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Avatar, Dropdown } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import LibrelloLogo from "@/components/modules/shared/LibrelloLogo";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully.");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const userNavLinks = [
    { title: "Account Profile", href: "/dashboard/user/profile" },
    { title: "Dashboard Overview", href: "/dashboard/user/userOverview" },
    { title: "Circulation History", href: "/dashboard/user/userDeliveryHistory" },
    { title: "Reading List", href: "/dashboard/user/myReadingList" },
    { title: "Archival Reviews", href: "/dashboard/user/myReviews" },
    { title: "Browse Archive", href: "/books" },
  ];

  const librarianNavLinks = [
    { title: "Curator Profile", href: "/dashboard/librarian/profile" },
    { title: "Archive Overview", href: "/dashboard/librarian/overview" },
    { title: "Catalog Inventory", href: "/dashboard/librarian/manageInventory" },
    { title: "Add Edition", href: "/dashboard/librarian/addBook" },
    { title: "Manage Deliveries", href: "/dashboard/librarian/manageDeliveries" },
    { title: "Browse Archive", href: "/books" },
  ];

  const adminNavLinks = [
    { title: "Archival Profile", href: "/dashboard/admin/profile" },
    { title: "System Overview", href: "/dashboard/admin/overview" },
    { title: "Book Approvals", href: "/dashboard/admin/bookApproval" },
    { title: "Manage Collection", href: "/dashboard/admin/manageBooks" },
    { title: "Member Registry", href: "/dashboard/admin/users" },
    { title: "Circulation Ledger", href: "/dashboard/admin/viewTransactions" },
    { title: "Browse Archive", href: "/books" },
  ];

  const menus =
    user?.role === "admin"
      ? adminNavLinks
      : user?.role === "librarian"
      ? librarianNavLinks
      : userNavLinks;

  if (!mounted) return null;

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="lg:hidden h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-40">
        <LibrelloLogo size="sm" />
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-foreground cursor-pointer"
          aria-label="Open Sidebar Menu"
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-[280px] h-screen bg-card border-r border-border z-50 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div>
            <LibrelloLogo size="sm" />
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
              {user?.role || "member"} portal
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <svg
              width="16"
              height="16"
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

        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menus.map((item, ind) => {
            const isActive =
              pathname === item.href || item.href.includes(pathname + "?");
            return (
              <Link
                key={ind}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "text-muted-foreground hover:bg-card-soft hover:text-foreground"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium text-red-600 rounded-lg border border-border hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-card border-r border-border p-5 shadow-xs select-none">
        <div>
          <LibrelloLogo size="default" />
          <div className="mt-2 pl-0.5">
            <span className="text-[10px] uppercase tracking-widest text-primary font-semibold block">
              {user?.role || "member"} portal
            </span>
          </div>
        </div>

        <nav className="mt-8 space-y-1 flex-1 overflow-y-auto">
          {menus.map((item, ind) => {
            const isActive =
              pathname === item.href || item.href.includes(pathname + "?");
            return (
              <Link
                key={ind}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-card-soft hover:text-foreground"
                }`}
              >
                <span>{item.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM USER PANEL */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <Avatar.Image
                alt={session?.user?.name || "User"}
                src={session?.user?.image}
                referrerPolicy="no-referrer"
              />
              <Avatar.Fallback className="bg-primary text-white text-xs font-serif">
                {session?.user?.name ? session.user.name.charAt(0) : "L"}
              </Avatar.Fallback>
            </Avatar>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-foreground truncate">
                {session?.user?.name || "Member"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 text-xs font-medium text-red-600 rounded-lg border border-border hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
