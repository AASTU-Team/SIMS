import { Table } from "antd";
import type { TableColumnsType } from "antd";

const data = [
  {
    date: "Feb 19, 2021",
    attendance: "Present" 
  },
];
export default function Attendance() {
  const columns: TableColumnsType = [
    {
      title: "Date",
      width: 100,
      dataIndex: "date",
      key: "date",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      width: 70,
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <Table columns={columns} dataSource={data} pagination={false} bordered/>
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-1">
          <span className="text-md font-bold">Total Present Classes:</span>
          <span className="text-md font-bold">19</span>
        </div>
        <div className="flex gap-1">
          <span className="text-md font-bold">Total Absent Classes:</span>
          <span className="text-md font-bold">19</span>
        </div>
        <div className="flex gap-1">
          <span className="text-md font-bold">Attendance Percentage:</span>
          <span className="text-md font-bold">50%</span>
        </div>
      </div>
    </div>
  );
}
