import { Tabs } from "antd";
import type { TabsProps } from "antd";
import Registration from "./Registration";
import AddDrop from "./AddDrop";
import RegistrationHistory from "./RegistrationHistory";
import AddDropHistory from "./AddDropHistory";
import WithdrawalReadmission from "./WithdrawalReadmission";


const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Registration",
    children: <Registration />,
  },
  {
    key: "2",
    label: "Add/Drop Courses",
    children: <AddDrop />,
  },
  {
    key: "3",
    label: "Withdrawal & Readmission",
    children: <WithdrawalReadmission/>,
  },
  {
    key: "4",
    label: "Registration History",
    children: <RegistrationHistory />,
  },
  {
    key: "5",
    label: "Add/Drop History",
    children: <AddDropHistory />,
  },
];

export default function StudentRegistration() {
  return (
    <div className="max-w-screen-2xl p-4 md:p-5 2xl:p-8">
      <Tabs defaultActiveKey="1" items={items}  size="large" />
    </div>
  )
}
