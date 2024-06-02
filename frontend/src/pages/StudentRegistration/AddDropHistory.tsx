import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { SlipDetails } from "../../type/registration";
import RegistrationSlip from "./RegistrationSlip";

export default function AddDropHistory() {
  const columns: TableColumnsType<SlipDetails> = [
    {
      title: "Stream",
      width: 100,
      dataIndex: "stream",
      key: "stream",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Admission Classification",
      dataIndex: "classification",
      key: "code",
      width: 100,
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
      width: 100,
    },
    {
      title: "Academic Year",
      dataIndex: "ac_year",
      key: "ac_year",
      width: 70,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 70,
    },
    {
      title: "Semester",
      dataIndex: "sem",
      key: "sem",
      width: 70,
    },
  ];
  const data = [
    {
      stream: "Software Engineering",
      classification: "Regular",
      program: "Masters",
      year: "1",
      sem: "I",
      ac_year: "2023/2024",
    },
  ];
  return (
    <div className="pt-1 flex flex-col gap-5">
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-5 bg-white">
              <RegistrationSlip details={record} />
            </div>
          ),
        }}
      />
    </div>
  );
}
