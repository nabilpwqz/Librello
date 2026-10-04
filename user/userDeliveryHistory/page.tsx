import UserDeliveryHistory from "@/components/modules/dashboard/user/UserDeliveryHistory";
import { getUserPaymentDetailsByEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Circulation History | Sanctuary Reader Dashboard | Librello",
  description:
    "Track your book delivery history, completed orders, and circulation status from your Librello reader dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const UserDeliveryHistoryPage = async () => {
  let session = null;
  try {
    session = await getUserSession();
  } catch {
    session = null;
  }

  let userPayment: any[] = [];
  if (session?.email) {
    try {
      const res = await getUserPaymentDetailsByEmail(session.email);
      if (Array.isArray(res)) {
        userPayment = res;
      } else if (Array.isArray(res?.data)) {
        userPayment = res.data;
      } else if (Array.isArray(res?.payments)) {
        userPayment = res.payments;
      }
    } catch {
      userPayment = [];
    }
  }

  return (
    <div className="min-h-screen">
      <UserDeliveryHistory userPayment={userPayment} />
    </div>
  );
};

export default UserDeliveryHistoryPage;
