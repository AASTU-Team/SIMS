import React from "react";
import { Button, Table } from "antd";
import type { TableColumnsType } from "antd";
// import { useQuery } from "@tanstack/react-query";
// import Loader from "../../components/Loader";
import CourseTable from "./CoursesTable";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { getStudentCoursesSemesters } from "../../api/student";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";
import  MyDocument  from "../../components/Report";
import { pdf } from "@react-pdf/renderer";

interface StudentSemesterStatus {
  semester: number;
  year: number;
  gpa: number;
  courses: CourseFields[];
}

const GradesTable: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  const query = useQuery({
    queryKey: ["studentSemesterStatus"],
    queryFn: () => getStudentCoursesSemesters(user._id),
  });
  console.log(query);
  const downloadPDF = async () => {
    try {
      // Render the PDF to a blob
      const blob = await pdf(<MyDocument data={[1, 2, 3]} />).toBlob();

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "document.pdf";

      // Append the anchor element to the DOM
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up the temporary anchor element
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

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
      title: "GPA",
      dataIndex: "GPA",
      key: "GPA",
      width: 150,
    },
    // {
    //   title: "Action",
    //   key: "operation",
    //   fixed: "right",
    //   width: 100,
    //   render: (text, record) => (
    //     <Button onClick={() => downloadPDF()}>Generate Report</Button>
    //   ),
    // },
  ];
  return (
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
          dataSource={
            Array.isArray(query?.data?.data?.message)
              ? query?.data?.data?.message
              : []
          } // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 1300 }}
          rowKey={(record: StudentSemesterStatus) =>
            `${record.semester}${record.year}${record.gpa}`
          }
          expandable={{
            expandedRowRender: (record: StudentSemesterStatus) => (
              <div className="p-2 bg-white">
                <CourseTable
                  records={record.courses.map((value) => ({
                    grade: value.grade,
                    name: value.courseID.name,
                    code: value.courseID.code,
                    credit: value.courseID.credits,
                  }))}
                />
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};
export default GradesTable;
