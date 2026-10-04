import UserOverview from "@/components/modules/dashboard/user/UserOverview";
import { getUserPaymentDetailsByEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Overview | Reader Dashboard | Librello",
  description:
    "View your reading activity, borrowing statistics, delivery updates, and account overview from your Librello reader dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const UserOverviewPage = async () => {
  const user = await getUserSession();

  const userPayment = await getUserPaymentDetailsByEmail(user?.email);

  return (
    <div className="min-h-screen">
      <UserOverview userPayment={userPayment} user={user} />
    </div>
  );
};

export default UserOverviewPage;
