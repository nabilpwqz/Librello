import MyReviews from "@/components/modules/dashboard/user/MyReviews";
import { getUserCommentById } from "@/lib/api/users";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Archival Reviews & Marginalia | Reader Dashboard | Librello",
  description:
    "View, manage, and edit your recorded book reviews, literary marginalia, and community ratings from your Librello reader dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

const UserMyReviewsPage = async () => {
  let session = null;
  try {
    session = await getUserSession();
  } catch {
    session = null;
  }

  let comments: any[] = [];
  if (session?.id) {
    try {
      const res = await getUserCommentById(session.id);
      if (Array.isArray(res)) {
        comments = res;
      } else if (Array.isArray(res?.data)) {
        comments = res.data;
      } else if (Array.isArray(res?.comments)) {
        comments = res.comments;
      }
    } catch {
      comments = [];
    }
  }

  return (
    <div className="min-h-screen">
      <MyReviews comments={comments} />
    </div>
  );
};

export default UserMyReviewsPage;
