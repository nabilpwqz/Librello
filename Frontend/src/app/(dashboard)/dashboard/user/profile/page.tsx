import UserProfile from "@/components/modules/dashboard/user/UserProfile";
import { getUserPaymentDetailsByEmail } from "@/lib/api/payment";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "My Profile | Librello",
  description:
    "Manage your profile, track your reading activity, and update your account information.",
  robots: {
    index: false,
    follow: false,
  },
};

const UserProfilePage = async () => {
  let session = null;
  try {
    session = await getUserSession();
  } catch (e) {
    console.error("Session lookup error in UserProfilePage", e);
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
    } catch (e) {
      console.error("Failed to fetch user payments in UserProfilePage", e);
      userPayment = [];
    }
  }

  return (
    <div>
      <UserProfile userPayment={userPayment} />
    </div>
  );
};

export default UserProfilePage;
