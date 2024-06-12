import { Tabs } from "antd";
import type { TabsProps } from "antd";
import EnrolledCoursesTable from "./EnrolledCoursesTable";
import AllCoursesTable from "./AllCoursesTable";
import InCompleteCourses from "./IncompleCourses";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Enrolled Courses",
    children: <EnrolledCoursesTable />,
  },
  {
    key: "2",
    label: "Completed Courses",
    children: <AllCoursesTable />,
  },
  {
    key: "3",
    label: "Incomplete Courses",
    children: <InCompleteCourses />,
  },

];

export default function StudentCourses() {
  return (
    <div className="max-w-screen-3xl p-4 md:p-5 2xl:p-8">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
