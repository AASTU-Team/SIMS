import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { RootState } from "../../state/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getEnrolledCourse } from "../../api/student";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";
import CourseDetails from "./CourseDetails";


export default function EnrolledCoursesTable() {
  const user = useSelector((state: RootState) => state.user);
  const query = useQuery({
    queryKey: ["myEnrolledCourse"],
    queryFn: () => getEnrolledCourse(user._id),
  });
  console.log(query)
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
        key: "credit",
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
      ) : query?.data?.data?.message === "Course Not found" ? (
        <div>{`No Course Found`}</div>
      ) : (
        <Table
          columns={columns}
          dataSource={Array.isArray(query.data?.data?.message) ? query.data?.data?.message : []}
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
