import ManageUser from "@/components/modules/dashboard/admin/ManageUser";
import { getUserList } from "@/lib/api/users";

export const metadata = {
  title: "Member Registry | Admin Dashboard | Librello",
  description:
    "Manage member accounts, curator roles, permissions, and monitor registered readers from the Librello admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const AdminUsersPage = async () => {
  const data = await getUserList();
  const users = data?.users || [];

  return (
    <div>
      <ManageUser users={users} />
    </div>
  );
};

export default AdminUsersPage;
