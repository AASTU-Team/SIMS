import AttendanceTable from "./table";
import { useState } from "react";
import { Select, type TableColumnsType } from "antd";

export default function AttendanceManagement() {
  const [records, setRecords] = useState<TableColumnsType>([]);

  const columns = [
    {
      title: "Student Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Student ID",
      width: 150,
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: true,
    },
  ];



  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Student Grades</div>
        <div className="flex gap-4 items-start justify-start">
          <Select
            showSearch
            placeholder="Select Course"
            optionFilterProp="children"
            className=" h-10 w-80"
            options={[
              {
                value: "Undergraduate",
                label: "Bachelors Degree",
              },
              {
                value: "Masters",
                label: "Masters Degree",
              },
              {
                value: "PhD",
                label: "PhD",
              },
            ]}
          />
          <Select
            showSearch
            placeholder="Select Section"
            optionFilterProp="children"
            className=" h-10 w-50"
            options={[
              {
                value: "Undergraduate",
                label: "Bachelors Degree",
              },
              {
                value: "Masters",
                label: "Masters Degree",
              },
              {
                value: "PhD",
                label: "PhD",
              },
            ]}
          />
          <Select
            showSearch
            placeholder="Select Admission Type"
            optionFilterProp="children"
            mode="multiple"
            className=" h-10 w-50"
            options={[
              {
                value: "Regular",
                label: "Regular",
              },
              {
                value: "Add",
                label: "Add",
              },
            ]}
          />
        </div>
      </div>
      <AttendanceTable
        columns={[
          ...columns.map((column) => ({ ...column, fixed: undefined })),
          ...records,
        ]}
      />
    </div>
  );
}
