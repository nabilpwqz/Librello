import MyReadingList from "@/components/modules/dashboard/user/MyReadingList";
import { getUserPaymentDetailsByEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Reading Shelf | Sanctuary Reader Dashboard | Librello",
  description:
    "View and manage your active reading shelf, track reading progress, and initiate courier returns from your Librello reader dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const UserMyReadingListPage = async () => {
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
      <MyReadingList userPayment={userPayment} />
    </div>
  );
};

export default UserMyReadingListPage;
