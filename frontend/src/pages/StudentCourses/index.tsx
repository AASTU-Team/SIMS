import { Tabs } from "antd";
import type { TabsProps } from "antd";
import EnrolledCoursesTable from "./EnrolledCoursesTable";
import AllCoursesTable from "./AllCoursesTable";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Enrolled Courses",
    children: <EnrolledCoursesTable />,
  },
  {
    key: "2",
    label: "All Courses",
    children: <AllCoursesTable />,
  }
];

export default function StudentCourses() {
  return (
    <div className="max-w-screen-3xl p-4 md:p-5 2xl:p-8">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
