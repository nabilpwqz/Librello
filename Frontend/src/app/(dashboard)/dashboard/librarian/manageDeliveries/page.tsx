import ManageDeliveries from "@/components/modules/dashboard/librarian/ManageDeliveries";
import { getBooksByLibrarianId } from "@/lib/api/books";
import { getPaymentDetailsByLibrarianEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Manage Circulations | Curator Dashboard | Librello",
  description:
    "Track, manage, and monitor volume circulation requests, shipment status, and member deliveries from the curator dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const LibrarianManageDeliveriesPage = async () => {
  const librarian = await getUserSession();
  const librarianId = librarian?.id;

  const payments = await getPaymentDetailsByLibrarianEmail(librarian?.email);

  const books = await getBooksByLibrarianId(librarianId);

  return (
    <div className="min-h-screen">
      <ManageDeliveries books={books} payments={payments} />
    </div>
  );
};

export default LibrarianManageDeliveriesPage;
