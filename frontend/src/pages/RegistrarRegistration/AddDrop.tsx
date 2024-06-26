import { useQuery } from "@tanstack/react-query";
import {  Table, Button } from "antd";
import type { TableColumnsType } from "antd";
import { useNavigate } from "react-router-dom";
import {  getAddDropRequestReg } from "../../api/registration";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";

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
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Program",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
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
      dataIndex: "semester",
      key: "semester",
      width: 70,
    },

    {
      title: "Date of Registration",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        // console.log(date);
        const d = new Date(date);
        const formattedDate = `${("0" + d.getDate()).slice(-2)}-${(
          "0" +
          (d.getMonth() + 1)
        ).slice(-2)}-${d.getFullYear()}`;
        return <span>{formattedDate}</span>;
      },
      width: 150,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (text, record) => (
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
   const query = useQuery({
     queryKey: ["getDepartmentAddDropRequest"],
     queryFn: ()=>getAddDropRequestReg("pending"),
   });
  //  console.log("ADD Drop",query)
  
  return (
    <div className="pt-2">
      {query.isPending ? (
        <div className="h-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          dataSource={query?.data?.data?.data?.map(
            ({
              stud_id,
              createdAt,
              courseToAdd,
              courseToDrop,
              _id
            }: {
              stud_id: CourseFields;
              createdAt: string;
              courseToAdd: CourseFields[];
              courseToDrop: CourseFields[];
              _id:string;
            }) => ({ ...stud_id, createdAt, courseToAdd, courseToDrop, addDrop_id:_id})
          )}
          scroll={{ x: 450 }}
        />
      )}
    </div>
  );
}
