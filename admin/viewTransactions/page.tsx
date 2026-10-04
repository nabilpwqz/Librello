import ViewTransactions from "@/components/modules/dashboard/admin/ViewTransactions";
import { getAllPaymentDetails } from "@/lib/api/payment";

export const metadata = {
  title: "Circulation Ledger | Admin Dashboard | Librello",
  description:
    "Review and monitor all payment transactions, circulation history, and financial activities from the Librello admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const AdminViewTransactionsPage = async () => {
  const payments = await getAllPaymentDetails();

  return (
    <div>
      <ViewTransactions payments={payments} />
    </div>
  );
};

export default AdminViewTransactionsPage;
