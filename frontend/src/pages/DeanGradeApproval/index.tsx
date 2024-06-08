import { Table, TableColumnsType } from "antd";
import StudentsList from "./students";

export default function DeanGradeApproval() {
  const data = [
    {
      key: "1",
      department:"Software Engineering",
      name: "John Brown",
      course_name: "Math 101",
      code: "MATH101",
      year: "2021",
      semester: "Spring",
      request_date: "2021-05-06",
    },
  ];
  const columns: TableColumnsType = [
    {
      title: "Instructor's Name",
      width: 250,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 250,
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      width: 250,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 150,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      width: 150,
    },
    {
      title: "Program Type",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Request Date",
      dataIndex: "request_date",
      key: "request_date",
      render: (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        return <span>{formattedDate}</span>;
      },
      width: 150,
    },
  ];

  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between mb-5">
        <div className="text-title-md">Grade Approval</div>
      </div>
      <Table
        columns={columns}
        dataSource={data} // Fix: Access the 'data' property of the resolved data
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: () => (
            <div className="p-1 bg-white">
              <StudentsList />
            </div>
          ),
        }}
      />
    </div>
  );
}
