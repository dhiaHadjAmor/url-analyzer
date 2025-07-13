import DashboardResults from "./components/DashboardResults/DashboardResults";
import UrlSearchBar from "./components/UrlSearchBar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-5 max-w-7xl">
        <section className="bg-white shadow-md rounded-md p-6 mb-6 w-full flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Analyze a Website</h2>
          <UrlSearchBar />
        </section>

        <DashboardResults />
      </main>
    </div>
  );
};

export default DashboardPage;
