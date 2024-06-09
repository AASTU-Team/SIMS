import React from 'react';
import { Table} from 'antd';
import type { TableColumnsType } from "antd";

interface StudentsType {
    studentId: string;
    name: string;
    _id: string;
    isOutofBatch: boolean;
}

const AttendanceTable: React.FC<{ columns: TableColumnsType,data:StudentsType[]}> = ({ columns,data }) =>
  {
    // const query = useQuery({
    //     queryKey: ["semester"],
    //     queryFn: getSemester,
    //   });
    // console.log(query?.data?.data)
    console.log(data)
    
    return (
      <div className="shadow-lg py-4 ">
            <Table
              columns={columns}
              dataSource={data || []} // Fix: Access the 'data' property of the resolved data
              scroll={{ x: 1300 }}
            />
      </div>
    );
  }
export default AttendanceTable;