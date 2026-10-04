import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className=" min-h-screen transition-colors duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
