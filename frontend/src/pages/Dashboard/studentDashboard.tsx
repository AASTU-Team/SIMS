import DashboardCards from "../../components/Cards";
import {
  FileDoneOutlined,
  FileSyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import ChartOne from "../../components/LineChart";
import ChartThree from "../../components/PieChart";

export default function StudentDashboard() {
  const data = [
    {
      title: "Enrolled Courses",
      total: "6",
      rate: "0.5%",
      children: <FileSyncOutlined />,
    },
    {
      title: "Completed Courses",
      total: "6",
      rate: "0.5%",
      children: <FileDoneOutlined />,
    },
    {
      title: "Incomplete Courses",
      total: "6",
      rate: "0.5%",
      children: <FileExcelOutlined />,
    },
  ];

  return (
    <div >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {data.map((d) => (
          <DashboardCards key={d.title} title={d.title} total={d.total}>
            {d.children}
          </DashboardCards>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartThree />
      </div>
    </div>
  );
}
