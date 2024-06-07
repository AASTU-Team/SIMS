import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
// import { useQuery } from "@tanstack/react-query";
// import { getCourse } from "../../api/course";
// import Loader from "../../components/Loader";

const CourseTable: React.FC = () => {
  // const query = useQuery({
  //   queryKey: ["course"],
  //   queryFn: getCourse,
  // });
  // console.log(query)
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
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
        dataSource={[]} // Fix: Access the 'data' property of the resolved data
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default CourseTable;
