import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import SectionDetails from "./SectionDetail";
import { useQuery } from "@tanstack/react-query";
import { getBatchCourses } from "../../api/registration";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

type BatchCoursesProps = {
  semesterId: string;
  batch: string;
  semester: string;
  type:string;
};

const data = [
  {
    key: "1",
    name: "Data Structure",
    code: "CS-301",
    lec: "3",
    lab: "1",
    tut: "0",
    hs: "0",
    category: "Core",
    option: "Regular",
    credit: "4",
  },
  {
    key: "2",
    name: "Data Structure",
    code: "CS-301",
    lec: "3",
    lab: "1",
    tut: "0",
    hs: "0",
    category: "Core",
    option: "Regular",
    credit: "4",
  },
];

export default function CourseTable(state:BatchCoursesProps) {
//   console.log(state)
  
  const user = useSelector((state: RootState) => state.user);
  const query = useQuery({
    queryKey: ["batchCourses"],
    queryFn: () =>
      getBatchCourses(
        user._id,
        parseInt(state.batch),
        parseInt(state.semester),
        state.type
      ),
  });
  console.log(query)
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
        <Table
            columns={columns}
            dataSource={data}
            scroll={{ x: 1300 }}
            expandable={{
                expandedRowRender: (record:CourseFields) => (
                    <div className="p-2 bg-white">
                        <SectionDetails semester={state} course={record}/>
                    </div>
                ),
            }}
        />
    </div>
  );
}
