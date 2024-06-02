import { Input, Table } from "antd";
import type { TableColumnsType } from "antd";

const data = [
  {
    name: "Assignment",
    mark: 19,
    max: 20
  },
];
export default function GradesTable() {
  const columns: TableColumnsType = [
    {
      title: "Assessment Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Marks /20",
      dataIndex: "mark",
      key: "mark",
      width: 100,
      render: (text, record) => (
        <div className="flex gap-1">
          <Input defaultValue={record.mark} />
        </div>
      ),
    }
  ];
  return (
    <div className="flex flex-col gap-5">
      <Table columns={columns} dataSource={data} pagination={false} />
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-1">
          <span className="text-md font-bold">Total Marks:</span>
          <span className="text-md font-bold">19</span>
        </div>
        <div className="flex gap-1">
          <span className="text-md font-bold">Final Grade:</span>
          <span className="text-md font-bold">A</span>
        </div>
      </div>
    </div>
  );
}
