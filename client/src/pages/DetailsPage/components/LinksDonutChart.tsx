import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

type LinksDonutChartProps = {
  internal: number;
  external: number;
};

const LinksDonutChart = ({ internal, external }: LinksDonutChartProps) => {
  const data = {
    labels: ["Internal", "External"],
    datasets: [
      {
        data: [internal, external],
        backgroundColor: ["#3B82F6", "#F97316"],
        hoverBackgroundColor: ["#2563EB", "#EA580C"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-xs mx-auto">
      <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
        Internal vs External Links
      </h3>
      <Doughnut data={data} />
    </div>
  );
};

export default LinksDonutChart;
