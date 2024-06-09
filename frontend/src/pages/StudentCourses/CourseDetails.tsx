import { Tabs } from "antd";
import type { TabsProps } from "antd";
import GradesTable from "./GradesTable";
import Attendance from "./Attendance";
import { CourseFields } from "../../type/course";


export default function CourseDetails({records}:{records:CourseFields}) {
    const items: TabsProps["items"] = [
      {
        key: "1",
        label: "Grades",
        children: <GradesTable />,
      },
      {
        key: "2",
        label: "Attendance",
        children: <Attendance course={records._id || ""} />,
      }
    ];
    console.log(records)
  return (
    <div className="">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
