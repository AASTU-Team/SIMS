import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { getStudent } from "../../api/student";
import Loader from "../../components/Loader";
import CourseDetails from "./CourseDetails";

export default function StudentGrades() {
  const query = useQuery({
    queryKey: ["student"],
    queryFn: getStudent,
  });
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
      fixed: "left",
      sorter: true,
    },
    {
      title: "Enrolled Course",
      dataIndex: "course",
      key: "course",
      fixed: "left",
      width: 250,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      width: 150,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 150,
    },
  ];
  return (
    <div className="max-w-screen-2xl p-2 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Student Management</div>
      </div>
      <div className="shadow-lg py-4 ">
        {query.isPending ? (
          <div className="h-auto">
            <Loader />
          </div>
        ) : query.isError ? (
          <>{`${query.error}`}</>
        ) : (
          <Table
            columns={columns}
            dataSource={query?.data?.data?.message || []} // Fix: Access the 'data' property of the resolved data
            scroll={{ x: 1300 }}
            expandable={{
              expandedRowRender: () => (
                <div className="p-2 bg-white">
                  <CourseDetails/>
                </div>
              ),
            }}
          />
        )}
      </div>
    </div>
  );
}
