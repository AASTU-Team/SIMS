import { Tabs } from "antd";
import type { TabsProps } from "antd";
import GradesTable from "./GradesTable";
import Attendance from "./Attendance";


export default function CourseDetails() {
    const items: TabsProps["items"] = [
      {
        key: "1",
        label: "Grades",
        children: <GradesTable />,
      },
      {
        key: "2",
        label: "Attendance",
        children: <Attendance />,
      }
    ];
  return (
    <div className="">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
