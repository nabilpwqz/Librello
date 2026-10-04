import React from "react";
import DashboardSidebar from "@/components/modules/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

const DashBoardLayout = ({ children }: DashBoardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
};

export default DashBoardLayout;
