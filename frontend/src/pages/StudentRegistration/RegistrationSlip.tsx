import {  Table } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";




export default function RegistrationSlip({data}:{data:CourseFields[]}) {
  
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
    <div className="flex flex-col pt-5">
      
        <Table
          columns={columns}
          dataSource={data} 
          scroll={{ x: 1300 }}
        />
      
    </div>
  );
}
