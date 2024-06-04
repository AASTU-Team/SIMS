import { Popconfirm, Table, Button } from "antd";
import type { TableColumnsType } from "antd";
import { SlipDetails } from "../../type/registration";

export default function WithDrawalReadmit() {
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
      fixed:"left",
      key: "student_id",
      sorter: true,
    },
    {
      title: "Type",
      width: 150,
      dataIndex: "type",
      fixed:"left",
      key: "type",
      sorter: true,
    },
    {
      title: "Stream",
      width: 150,
      dataIndex: "stream",
      key: "stream",
      sorter: true,
    },
    {
      title: "Admission Classification",
      dataIndex: "classification",
      key: "code",
      width: 150,
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
      width: 100,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
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
      key: "1",
      name: "Yabsera Haile",
      student_id: "ETS0660/12",
      stream: "Software Engineering",
      classification: "Regular",
      program: "Masters",
      year: "1",
      sem: "I",
      ac_year: "2023/2024",
      type:"Withdrawal",
      reason: "Withdrawal Because I'm sick" ,
    },
    {
      key: "1",
      name: "Yabsera Haile",
      student_id: "ETS0660/12",
      stream: "Software Engineering",
      classification: "Regular",
      program: "Masters",
      year: "1",
      sem: "I",
      ac_year: "2023/2024",
      type:"Readmission",
      reason: "Withdrawal Because I'm sick" ,
    },
  ];
  return (
    <div className="pt-2">
    
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-3 bg-white flex flex-col gap-2">
              <span className="font-semibold">Reason for {record?.type}</span>
              <div className="">{record?.reason}</div>
            </div>
          ),
        }}
      />
    </div>
  );
}
