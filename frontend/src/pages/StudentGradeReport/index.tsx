import { Tabs } from "antd";
import type { TabsProps } from "antd";
import GradesTable from "./GradesTable";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Grades Table",
    children: <GradesTable />,
  },
];



export default function StudentGradeReport() {
  return (
    <div className="max-w-screen-3xl p-4 md:p-5 2xl:p-8">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
