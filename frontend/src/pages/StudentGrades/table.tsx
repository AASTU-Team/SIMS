import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { TableRowSelection } from "antd/es/table/interface";

interface StudentsType {
  studentId: string;
  name: string;
  _id: string;
  isOutofBatch: boolean;
}

const AttendanceTable: React.FC<{
  columns: TableColumnsType;
  data: StudentsType[];
  rowSelection: TableRowSelection<StudentsType>; // Provide the appropriate type argument for rowSelection
}> = ({ columns, data, rowSelection }) => {
  // const query = useQuery({
  //     queryKey: ["semester"],
  //     queryFn: getSemester,
  //   });
  // console.log(query?.data?.data)
  console.log(data);
  

  return (
    <div className="shadow-lg py-4 ">
      <Table
        columns={columns}
        dataSource={data || []} // Fix: Access the 'data' property of the resolved data
        scroll={{ x: 1300 }}
        rowSelection={rowSelection}
        pagination={{ pageSize: 10 }}
        rowKey={(record) => record._id}
      />
    </div>
  );
};
export default AttendanceTable;
