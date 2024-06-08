import {  Table, Button } from "antd";
import type { TableColumnsType } from "antd";
import { SlipDetails } from "../../type/registration";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAddDropRequest } from "../../api/registration";

export default function AddDrop() {
  const navigate = useNavigate();
  const columns: TableColumnsType = [
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
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (text,record) => (
        <div className="font-semibold">
          <Button
            onClick={() => {
              navigate(`/studentReg/viewRequest/`, { state: record });
            }}
          >
            Review Request
          </Button>
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
  const query = useQuery({
    queryKey: ["getDepartmentAddDropRequest"],
    queryFn: () => getAddDropRequest("Accepted"),
  });
  console.log(query);
  return (
    <div className="pt-2">
      
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        
      />
    </div>
  );
}
