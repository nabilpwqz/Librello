import LibrarianProfile from "@/components/modules/dashboard/librarian/Profile";
import { getBooksByLibrarianId } from "@/lib/api/books";
import { getPaymentDetailsByLibrarianEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Curator Profile | Librello",
  description:
    "Manage your curator profile, monitor collection inventory, track earnings, and update archival information.",
  robots: {
    index: false,
    follow: false,
  },
};

const LibrarianProfilePage = async () => {
  const user = await getUserSession();

  const earnings = await getPaymentDetailsByLibrarianEmail(user?.email);

  const myBooks = await getBooksByLibrarianId(user?.id);

  return (
    <>
      <LibrarianProfile earnings={earnings} myBooks={myBooks} />
    </>
  );
};

export default LibrarianProfilePage;
