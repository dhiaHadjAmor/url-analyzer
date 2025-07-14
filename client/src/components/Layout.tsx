import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
