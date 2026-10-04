import LibrarianOverview from "@/components/modules/dashboard/librarian/Overview";
import { getBooksByLibrarianId } from "@/lib/api/books";
import { getPaymentDetailsByLibrarianEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Overview | Curator Dashboard | Librello",
  description:
    "View library performance, inventory insights, delivery statistics, and recent activities from the Librello curator dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const LibrarianOverviewPage = async () => {
  const librarian = await getUserSession();
  const librarianId = librarian?.id;

  const payments = await getPaymentDetailsByLibrarianEmail(librarian?.email);

  const books = await getBooksByLibrarianId(librarianId);

  return (
    <div className="min-h-screen">
      <LibrarianOverview books={books} payments={payments} librarian={librarian} />
    </div>
  );
};

export default LibrarianOverviewPage;
