import { useQuery } from "@tanstack/react-query";
import DashboardCards from "../../components/Cards";
import {
  FileDoneOutlined,
  FileSyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { getAssignmentInstructorData } from "../../api/registration";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useEffect, useState } from "react";

export default function StaffDashboard() {
  const user = useSelector((state: RootState) => state.user);

    const countQuery = useQuery({
      queryKey: ["countCourseStatus"],
      queryFn: () => getAssignmentInstructorData(user._id),
    });
    console.log("Count Query", countQuery);
    const [courses, setCourses] = useState<number>(
      countQuery.data?.data?.course|| 0
    );
    const [sections, setSections] = useState<number>(
      countQuery.data?.data?.section || 0
    );
    const [student, setStudent] = useState<number>(
      countQuery.data?.data?.student || 0
    );

    useEffect(() => {
      if (countQuery.data) {
        
        setCourses(countQuery.data?.data?.course || 0);
        setSections(countQuery.data?.data?.section || 0);
        setStudent(countQuery.data.data?.student || 0);
      }
    }, [countQuery.data]);

  const data = [
    {
      title: "Assigned Courses",
      total: courses.toString(),
      children: <FileSyncOutlined />,
    },
    {
      title: "Assigned Sections",
      total: sections.toString(),
      children: <FileDoneOutlined />,
    },
    {
      title: "Assigned Students",
      total: student.toString(),
      children: <FileExcelOutlined />,
    }
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
      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartStaff />
        <ChartTwo/>
      </div> */}
    </div>
  );
}

