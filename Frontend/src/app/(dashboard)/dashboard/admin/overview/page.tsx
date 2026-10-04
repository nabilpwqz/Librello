import AdminOverview from "@/components/modules/dashboard/admin/Overview";
import { getAdminBookCategories, getAdminStats } from "@/lib/api/admin";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Overview | Admin Dashboard | Librello",
  description:
    "View platform statistics, catalog category insights, and overall system performance from the Librello admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const AdminOverviewPage = async () => {
  const admin = await getUserSession();

  const statsData = await getAdminStats();
  const booksData = await getAdminBookCategories();

  const stats = statsData?.stats || {};
  const booksCategories = booksData?.categoryData || [];

  return (
    <div className="min-h-screen w-full">
      <AdminOverview stats={stats} booksCategories={booksCategories} admin={admin} />
    </div>
  );
};

export default AdminOverviewPage;
