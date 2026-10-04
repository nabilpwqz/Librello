import { requireRole } from "@/lib/core/session";

const UserLayout = async ({ children }) => {
  await requireRole("user");
  return children;
};

export default UserLayout;
