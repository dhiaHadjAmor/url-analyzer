import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UrlSearchBar from "./components/UrlSearchBar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* TODO: move the Header and Footer to a Layout component */}
      <Header />

      <main className="flex-grow container mx-auto px-4">
        <UrlSearchBar />

        {/* TODO: Add UrlTable here */}
        <section aria-label="Dashboard Results Table">
          <p className="text-gray-500">No data loaded yet.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
