import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";
import CourseDetails from "./CourseDetails";
import { getCourse } from "../../api/course";

export default function AllCourseTable() {
  const query = useQuery({
    queryKey: ["getCourse"],
    queryFn: getCourse,
  });
  console.log(query);
  const columns: TableColumnsType = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Lecture Hour",
      dataIndex: "lec",
      key: "lec",
      width: 70,
    },
    {
      title: "Lab. Hour",
      dataIndex: "lab",
      key: "lab",
      width: 70,
    },
    {
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 70,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 70,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 70,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 70,
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
          dataSource={query.data?.data?.data|| []}
          scroll={{ x: 1300 }}
          rowKey={(record) => record._id || ""}
          expandable={{
            expandedRowRender: (record: CourseFields) => (
              <div className="p-2 bg-white">
                <CourseDetails records={record} />
              </div>
            ),
          }}
        />
      )}
    </div>
  );
}
