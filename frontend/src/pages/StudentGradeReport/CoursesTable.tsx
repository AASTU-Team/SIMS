import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
// import { useQuery } from "@tanstack/react-query";
// import { getCourse } from "../../api/course";
// import Loader from "../../components/Loader";

const CourseTable: React.FC<CourseFields[]> = (records) => {
  // const query = useQuery({
  //   queryKey: ["course"],
  //   queryFn: getCourse,
  // });
  // console.log(query)
  // console.log(records,Array.isArray(records) )
  const columns: TableColumnsType<CourseFields> = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      width: 150,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 150,
    }
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
        />
      )} */}
      <Table
        columns={columns}
        dataSource={Array.isArray(records?.records)? records.records: []} // Fix: Access the 'data' property of the resolved data
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default CourseTable;
