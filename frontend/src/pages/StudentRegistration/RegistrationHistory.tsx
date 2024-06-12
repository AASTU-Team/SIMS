import { Table } from "antd";
import type { TableColumnsType } from "antd";
import RegistrationSlip from "./RegistrationSlip";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationHistory } from "../../api/registration";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";
import { CourseFields } from "../../type/course";

export default function RegistrationHistory() {
  const user = useSelector((state: RootState) => state.user);
   const query = useQuery({
      queryKey: ["registrationHistory",user._id],
      queryFn: () => getRegistrationHistory(user._id),
    });
    console.log(query)
  const columns: TableColumnsType = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 70,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      width: 70,
    },

    {
      title: "Date of Registration",
      dataIndex: "registration_date",
      key: "registration_date",
      render: (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        return <span>{formattedDate}</span>;
      },
      width: 150,
    },
  ];
  // const data = [{
  //      stream: "Software Engineering",
  //      classification: "Regular",
  //      program: "Masters",
  //      year: "1",
  //      sem: "I",
  //      ac_year: "2023/2024",
  //    }];
  return (
    <div className="pt-1 flex flex-col gap-5">
      {query.isPending ? (
        <div className="my-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          dataSource={query?.data?.data?.message}
          scroll={{ x: 1300 }}
          // expandable={{
          //   expandedRowRender: (record:{courses:CourseFields}) => (
          //     <div className="p-5 bg-white">
          //       <RegistrationSlip details={record.courses} />
          //     </div>
          //   ),
          // }}
        />
      )}
      {/* <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} /> */}
    </div>
  );
}
