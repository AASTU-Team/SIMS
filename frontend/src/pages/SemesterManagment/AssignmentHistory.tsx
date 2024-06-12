import { Table } from "antd";
import type { TableColumnsType } from "antd";
import {  useQuery } from "@tanstack/react-query";
import { getAssignmentHistory } from "../../api/registration";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";
import { StaffFields } from "../../type/staff";


export default function AssignmentHistory() {
 
  const query = useQuery({
    queryKey: [
      "assignmentHistory"
    ],
    queryFn: () =>getAssignmentHistory() || [],
  });

  console.log(query);
  const columns: TableColumnsType = [
    {
      title: "Instructor Name",
      width: 200,
      dataIndex: "assigned",
      key: "assigned",
      fixed: "left",
      sorter: true,
      render: (staff: StaffFields) => {
        return <span>{staff?.name}</span>;
      },
    },
    {
      title: "Course Name",
      dataIndex: "course",
      key: "course",
      width: 200,
      render: (course: CourseFields) => {
        return <span>{course?.name}</span>;
      },
    },
    {
      title: "Assignment Date",
      dataIndex: "date",
      key: "date",
      width: 200,
      render: (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        return <span>{formattedDate}</span>;
      },
    },
  ];
  return (
    <div className="pt-1 flex flex-col gap-5">
      {query.isPending ? (
        <div className="h-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          rowKey={(record) => record._id || ""}
          dataSource={query?.data?.data?.data || []}
          scroll={{ x: 1300 }}

        />
      )}
    </div>
  );
}
