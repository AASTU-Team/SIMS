import DashboardCards from "../../components/Cards";
import {
  FileDoneOutlined,
  FileSyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import ChartOne from "../../components/LineChart";
import ChartThree from "../../components/PieChart";
import { useQuery } from "@tanstack/react-query";
import { getStudentCoursesSemesters, getStudentCourseStatus } from "../../api/student";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const user = useSelector((state: RootState) => state.user);

  const countQuery = useQuery({
        queryKey: ["countCourseStatus"],
        queryFn:()=> getStudentCourseStatus(user._id),
      });
  console.log("Count Query",countQuery)

  const semesterQuery = useQuery({
      queryKey: ["studentSemesterStatus"],
      queryFn: () => getStudentCoursesSemesters(user._id),
    });
  console.log("Semester Query",semesterQuery)
  const [enrolled, setEnrolled] = useState<number>(countQuery.data?.data?.enrolled?.length || 0);
  const [completed, setCompleted] = useState<number>(countQuery.data?.data?.completed?.length || 0);
  const [incomplete, setIncomplete] = useState<number>(countQuery.data?.data?.left?.length || 0);
  const [failed, setFailed] = useState<number>(countQuery.data?.data?.fail?.length || 0);
 
  useEffect(() => {
    if (countQuery.data) {
      setEnrolled(countQuery.data.data.enrolled.length || 0);
      setCompleted(countQuery.data.data.completed.length || 0);
      setIncomplete(countQuery.data.data.left.length || 0);
      setFailed(countQuery.data.data.fail.length || 0);
    }
  }, [countQuery.data]);

  const data = [
    {
      title: "Enrolled Courses",
      total: enrolled.toString(),
      children: <FileSyncOutlined />,
    },
    {
      title: "Completed Courses",
      total: completed.toString(),
      children: <FileDoneOutlined />,
    },
    {
      title: "Incomplete Courses",
      total: incomplete.toString(),
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
        {/* <ChartOne /> */}
        <ChartThree enrolled={enrolled} completed={completed} failed={failed} incomplete={incomplete} />
      </div>
    </div>
  );
}
