import { Popconfirm, Table, Button } from "antd";
import type { TableColumnsType } from "antd";
import RegistrationSlip from "./RegistrationSlip";
import { SlipDetails } from "../../type/registration";

export default function Registration() {
  const columns: TableColumnsType<SlipDetails> = [
    {
      title: "Full Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "ID",
      width: 150,
      dataIndex: "student_id",
      key: "student_id",
      sorter: true,
    },
    {
      title: "Stream",
      width: 100,
      dataIndex: "stream",
      key: "stream",
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
      width: 100,
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
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="font-semibold">
          <Popconfirm
            title="Approve Request"
            description="Are you sure to approve this request?"
            onConfirm={() => console.log(text, record)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Approve</Button>
          </Popconfirm>
          
        </div>
      ),
    },
  ];
    const data = [
    {
      name: "Yabsera Haile",
      student_id: "ETS0660/12",
      stream: "Software Engineering",
      classification: "Regular",
      program: "Masters",
      year: "1",
      sem: "I",
      ac_year: "2023/2024",
    },
  ];
  return (
    <div className="pt-2">
      <div className="flex justify-end">
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
            Approve All Requests
          </button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-1 bg-white">
              <RegistrationSlip details={record}/>
            </div>
          ),
        }}
      />
    </div>
  );
}
