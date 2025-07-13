type HeadingsSummaryProps = {
  headings: Record<string, number>;
};

const headingOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];

const HeadingsSummary = ({ headings }: HeadingsSummaryProps) => {
  return (
    <div className="bg-white shadow-sm rounded-md p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Heading Summary
      </h3>
      <div className="grid grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700">
        {headingOrder.map((level) => (
          <div
            key={level}
            className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded"
          >
            <span className="font-medium">{level.toUpperCase()}</span>
            <span>{headings[level] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadingsSummary;
