import { Table, TableColumnsType } from "antd";
import StudentsList from "./students";
import { useQuery } from "@tanstack/react-query";
import { getDeanRequests } from "../../api/grade";
import { GradeApproval } from "../../type/registration";
import Loader from "../../components/Loader";

export default function DeanGradeApproval() {
  const query = useQuery({
    queryKey: ["getDeanGradeRequest"],
    queryFn: getDeanRequests,
  });
  console.log(query);
  const columns: TableColumnsType = [
    {
      title: "Instructor's Name",
      width: 150,
      dataIndex: "instructor_name",
      key: "instructor_name",
      fixed: "left",
      sorter: true,
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

  const data: GradeApproval[] = [];

  if (
    query.isSuccess &&
    query.data?.data?.message &&
    Array.isArray(query.data?.data?.message) &&
    query.data?.data?.message?.length > 0
  ) {
    for (let i = 0; i < query.data?.data?.message?.length; i++) {
      const instructor =
        query.data?.data?.message[i]?.grade_id?.instructor_id?.name;
      const course = query.data?.data?.message[i]?.grade_id?.course_id?.name;
      const prev = data?.find(
        (value: GradeApproval) =>
          value.instructor_name === instructor && value.course_name === course
      );
      if (prev && prev.students && prev.students.length > 0) {
        prev.students.push({
          name: query.data?.data?.message[i]?.grade_id?.student_id?.name,
          student_id: query.data?.data?.message[i]?.grade_id?.student_id?.id,
          grade: query.data?.data?.message[i]?.grade_id?.grade,
          attendance: query.data?.data?.message[i]?.attendance_percentage,
          grade_id: query.data?.data?.message[i]?._id,
        });
      } else {
        data.push({
          key: query.data?.data?.message[i]?._id,
          instructor_name: instructor,
          course_name: course,
          code: query.data?.data?.message[i]?.grade_id?.course_id?.code,
          request_date: query.data?.data?.message[i]?.requested_at,
          students: [
            {
              name: query.data?.data?.message[i]?.grade_id?.student_id?.name,
              student_id:
                query.data?.data?.message[i]?.grade_id?.student_id?.id,
              grade: query.data?.data?.message[i]?.grade_id?.grade,
              attendance: query.data?.data?.message[i]?.attendance_percentage,
              grade_id: query.data?.data?.message[i]?._id,
            },
          ],
        });
      }
    }
  }
  //  console.log("data data",data)

  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between mb-5">
        <div className="text-title-md">Grade Approval</div>
      </div>
      {query.isPending ? (
        <div className="">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : Array.isArray(data) ? (
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1300 }}
          expandable={{
            expandedRowRender: (record: GradeApproval) => (
              <div className="p-1 bg-white">
                <StudentsList records={record.students || []} />
              </div>
            ),
          }}
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}
