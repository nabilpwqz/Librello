import ManageInventory from "@/components/modules/dashboard/librarian/ManageInventory";
import { getBooksByLibrarianId } from "@/lib/api/books";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Manage Inventory | Curator Dashboard | Librello",
  description:
    "Manage your book inventory, update volume information, monitor availability, and organize your archive collection from the curator dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const ManageInventoryPage = async () => {
  const user = await getUserSession();

  const books = await getBooksByLibrarianId(user?.id);

  return (
    <div className="min-h-screen">
      <ManageInventory books={books} />
    </div>
  );
};

export default ManageInventoryPage;
