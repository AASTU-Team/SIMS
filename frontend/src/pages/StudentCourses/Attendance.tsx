import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { getStudentAttendance } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

const data = [
  {
    date: "Feb 19, 2021",
    attendance: "Present" 
  },
];
export default function Attendance({course}:{course:string}) {
  const user = useSelector((state: RootState) => state.user);
  // console.log(course)
  const columns: TableColumnsType = [
    {
      title: "Date",
      width: 100,
      dataIndex: "date",
      key: "date",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      width: 70,
    },
  ];
   const query = useQuery({
     queryKey: ["myAttendance", course],
     queryFn: () => getStudentAttendance(user._id, course),
   });
   console.log(query)
  return (
    <div className="flex flex-col gap-5">
      <Table columns={columns} dataSource={data} pagination={false} bordered/>
      <div className="flex flex-col gap-2 ">
        <div className="flex gap-1">
          <span className="text-md font-bold">Total Present Classes:</span>
          <span className="text-md font-bold">19</span>
        </div>
        <div className="flex gap-1">
          <span className="text-md font-bold">Total Absent Classes:</span>
          <span className="text-md font-bold">19</span>
        </div>
        <div className="flex gap-1">
          <span className="text-md font-bold">Attendance Percentage:</span>
          <span className="text-md font-bold">50%</span>
        </div>
      </div>
    </div>
  );
}
