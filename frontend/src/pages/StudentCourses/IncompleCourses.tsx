import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { getStudentCourseStatus } from "../../api/student";

export default function InCompleteCourses() {
  const user = useSelector((state: RootState) => state.user);

  const query = useQuery({
    queryKey: ["countCourseStatus"],
    queryFn:()=> getStudentCourseStatus(user._id),
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
        <>
          <Table
            columns={columns}
            dataSource={[]}
            scroll={{ x: 1300 }}
          />
        </>
      ) : (
        <Table
          columns={columns}
          dataSource={query.data?.data?.left || []}
          scroll={{ x: 1300 }}
          rowKey={(record) => record._id || ""}
        />
      )}
    </div>
  );
}
