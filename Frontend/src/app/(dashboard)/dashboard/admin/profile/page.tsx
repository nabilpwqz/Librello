import AdminProfile from "@/components/modules/dashboard/admin/Profile";
import { getAllBooks } from "@/lib/api/admin";
import { getAllPaymentDetails } from "@/lib/api/payment";
import { getUserList } from "@/lib/api/users";

export const metadata = {
  title: "Archival Administration | Librello",
  description:
    "Manage your administrator profile, update account information, and monitor platform analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

const AdminProfilePage = async () => {
  const data = await getUserList();
  const allUsers = data?.users || [];

  const allBooks = await getAllBooks();

  const allTransactions = await getAllPaymentDetails();

  return (
    <>
      <AdminProfile
        allUsers={allUsers}
        allBooks={allBooks}
        allTransactions={allTransactions}
      />
    </>
  );
};

export default AdminProfilePage;
