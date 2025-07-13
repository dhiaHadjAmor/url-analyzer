import Footer from "../../components/Footer";
import Header from "../../components/Header";
import DashboardResults from "./components/DashboardResults/DashboardResults";
import UrlSearchBar from "./components/UrlSearchBar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: move the Header and Footer to a Layout component */}
      <Header />

      <main className="flex-grow container mx-auto px-5 max-w-7xl">
        <section className="bg-white shadow-md rounded-md p-6 mb-6 w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Analyze a Website</h2>
          <UrlSearchBar />
        </section>

        <DashboardResults />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
