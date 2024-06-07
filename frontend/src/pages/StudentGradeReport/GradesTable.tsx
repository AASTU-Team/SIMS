import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
// import { useQuery } from "@tanstack/react-query";
// import Loader from "../../components/Loader";
import CourseTable from "./CoursesTable";

const data = [
  {
    key: "1",
    year: "2021",
    semester: "1",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "2",
    year: "2021",
    semester: "2",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "3",
    year: "2021",
    semester: "3",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "4",
    year: "2021",
    semester: "4",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "5",
    year: "2021",
    semester: "5",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "6",
    year: "2021",
    semester: "6",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "7",
    year: "2021",
    semester: "7",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
  {
    key: "8",
    year: "2021",
    semester: "8",
    academic_year: "2021",
    program: "Computer Science",
    gpa: "3.5",
  },
];


const GradesTable: React.FC = () => {
  // const query = useQuery({
  //   queryKey: ["semester"],
  //   queryFn: getSemester,
  // });
  // console.log(query?.data?.data);

  const columns: TableColumnsType = [
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
      title: "Academic Year",
      width: 150,
      dataIndex: "academic_year",
      key: "academic_year",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
      width: 150,
    },
    {
      title: "GPS",
      dataIndex: "gpa",
      key: "gpa",
      width: 150,
    },
  ];
  return (
    <div className="shadow-lg py-4 ">
      {/* {query.isPending ? (
        <div className="h-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          dataSource={query?.data?.data?.data || []} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 1300 }}
          expandable={{
            expandedRowRender: () => (
              <div className="p-2 bg-white">
                <CourseTable />
              </div>
            ),
          }}
        />
      )} */}
      <Table
        columns={columns}
        dataSource={data} // Fix: Access the 'data' property of the resolved data
        scroll={{ x: 1300 }}
        expandable={{
          expandedRowRender: () => (
            <div className="p-2 bg-white">
              <CourseTable />
            </div>
          ),
        }}
      />
    </div>
  );
};
export default GradesTable;
