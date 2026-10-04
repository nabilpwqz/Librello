import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Membership Application | Librello",
  description:
    "Create your Librello account to borrow books, manage your reading archive, request deliveries, and enjoy a seamless literary experience.",
  robots: {
    index: false,
    follow: false,
  },
};

const SignupPage = () => {
  return (
    <div className="min-h-screen">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
