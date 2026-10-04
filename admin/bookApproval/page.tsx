import BookApproval from "@/components/modules/dashboard/admin/BookApproval";
import { getAllPendingBooks } from "@/lib/api/admin";

export const metadata = {
  title: "Book Approvals | Admin Dashboard | Librello",
  description:
    "Review, approve, or reject pending book submissions from curators through the Librello admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const AdminBookApprovalPage = async () => {
  const books = await getAllPendingBooks();

  return (
    <div>
      <BookApproval books={books} />
    </div>
  );
};

export default AdminBookApprovalPage;
