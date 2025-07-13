import { Link, useParams } from "react-router-dom";

import { useUrlDetailsQuery } from "../../hooks/queries/useUrlDetailsQuery";
import Spinner from "../../components/Spinner";
import MetadataSection from "./components/MetadataSection";
import LinksDonutChart from "./components/LinksDonutChart";
import HeadingsSummary from "./components/HeadingsSummary";
import BrokenLinksTable from "./components/BrokenLinksTable";
import { ArrowLeft } from "lucide-react";

const DetailsPage = () => {
  const { id } = useParams();
  const numericId = parseInt(id ?? "0");
  const { data, isPending, isError } = useUrlDetailsQuery(numericId);

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-red-500 mt-10 text-center">
        Failed to load details.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-10">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-semibold">
        Details for:{" "}
        <a
          href={data.address}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all hover:text-blue-800"
          title={data.address}
        >
          {data.address}
        </a>
      </h1>
      <MetadataSection data={data} />
      <LinksDonutChart
        internal={data.linksInternal}
        external={data.linksExternal}
      />
      <HeadingsSummary headings={data.headings} />
      <BrokenLinksTable links={data.brokenLinks} />
    </div>
  );
};

export default DetailsPage;
