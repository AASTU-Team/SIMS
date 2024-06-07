import { Tabs } from "antd";
import type { TabsProps } from "antd";
import Registration from "./Registration";
import AddDrop from "./AddDrop";
import Withdrawal from "./Withdrawal";
import Readmission from "./Readmission";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Registration Requests",
    children: <Registration />,
  },
  {
    key: "2",
    label: "Add/Drop Requests",
    children: <AddDrop />,
  },
  {
    key: "3",
    label: "Withdrawal Requests",
    children: <Withdrawal />,
  },
  {
    key: "4",
    label: "Readmission Requests",
    children: <Readmission />,
  },
];

export default function DepartmentStudentRegistration() {
  return (
    <div className="max-w-screen-3xl p-2 md:p-2 2xl:p-5">
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
