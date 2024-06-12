import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { getStudentCourseGrade } from "../../api/grade";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";


export default function GradesTable({ course }: { course: string }) {
  const columns: TableColumnsType = [
    {
      title: "Assessment Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Marks",
      dataIndex: "mark",
      key: "mark",
      width: 70,
      render: (text, record) => (
        <div className="flex gap-1">
          <span>{record.mark}</span>
        </div>
      ),
    },
  ];
  const user = useSelector((state: RootState) => state.user);

  const query = useQuery({
    queryKey: ["myCourseGrade",course],
    queryFn: () => getStudentCourseGrade(user._id,course),
  });
  // console.log(query)
  const data: { name: string; mark: string}[] = [];
  if (query.isSuccess && query.data?.data && query.data?.data?.assessments) {
    query.data.data.assessments.forEach((element: { name: string; marks_obtained: number; value: number }) => {
      data.push({
        name: element.name,
        mark: `${element.marks_obtained}/${element.value}`,
      });
    });
    const responseData = query.data.data as {
      total_score: number;
      grade: string;
    };
    data.push({name:"Total Marks",mark:responseData?.total_score?.toString()});
    data.push({name:"Final Grade",mark:responseData?.grade});
  }
  // console.log("data",data)
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
          <div className="flex flex-col gap-2 ">
            <div className="flex gap-1">
              <span className="text-md font-bold">Total Marks:</span>
              <span className="text-md font-bold">19</span>
            </div>
            <div className="flex gap-1">
              <span className="text-md font-bold">Final Grade:</span>
              <span className="text-md font-bold">A</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
