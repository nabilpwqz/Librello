import { requireRole } from "@/lib/core/session";

const LibrarianLayout = async ({ children }) => {
  await requireRole("librarian");
  return children;
};

export default LibrarianLayout;
