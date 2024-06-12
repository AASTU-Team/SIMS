import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { getStudentAttendance } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";


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
  //  console.log(query)
  const data : {date:string,attendance:string}[] = []
  if(query.isSuccess && query.data?.data && query.data?.data[0]?.attendances){
    query.data.data[0].attendances.forEach((element:{date:string,status:string}) => {
      data.push({
        date: new Date(element.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        attendance: element.status
      });
    });
  }
  
  const presentCount = data?.filter((item) => item.attendance === "Present")?.length || 0;
  const absentCount = data?.filter((item) => item.attendance === "Absent")?.length || 0;


  return (
    <div className="flex flex-col gap-5">
      {query.isPending ? (
        <div className="h-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={data || []}
            pagination={false}
            bordered
          />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex gap-1">
              <span className="text-md font-bold">Total Present Classes:</span>
              <span className="text-md font-bold">{presentCount}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-md font-bold">Total Absent Classes:</span>
              <span className="text-md font-bold">{absentCount}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-md font-bold">Attendance Percentage:</span>
              <span className="text-md font-bold">
                {((presentCount / (presentCount + absentCount)) * 100).toFixed(2)} %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
