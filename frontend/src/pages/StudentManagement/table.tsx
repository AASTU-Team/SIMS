import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {StudentFields} from "../../type/student";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudent } from '../../api/student';
import Loader from '../../components/Loader';



const StudentTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["student"],
        queryFn: getStudent,
      });
    const columns: TableColumnsType<StudentFields> = [
      {
        title: "Full Name",
        width: 150,
        dataIndex: "name",
        key: "name",
        fixed: "left",
        sorter: true,
      },
      {
        title: "ID",
        width: 150,
        dataIndex: "id",
        key: "id",
        fixed: "left",
        sorter: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 250,
      },
      {
        title: "Phone",
        dataIndex: "contact",
        key: "contact",
        width: 150,
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        width: 150,
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        width: 150,
      },
      {
        title: "Department",
        dataIndex: "department_name",
        key: "department_name",
        width: 150,
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
        width: 150,
      },
      {
        title: "Admission Date",
        dataIndex: "admission_date",
        key: "admission_date",
        render: (date: string) => {
          const formattedDate = new Date(date).toISOString().split("T")[0];
          return <span>{formattedDate}</span>;
        },
        width: 150,
      },
      {
        title: "Date of Birth",
        dataIndex: "birthday",
        key: "birthday",
        render: (date: string) => {
          const formattedDate = new Date(date).toISOString().split("T")[0];
          return <span>{formattedDate}</span>;
        },
        width: 150,
      },
      {
        title: "Emergency Contact Name",
        dataIndex: "emergencycontact_name",
        key: "emergencycontact_name",
        width: 150,
      },
      {
        title: "Emergency Contact Phone",
        dataIndex: "emergencycontact_phone",
        key: "emergencycontact_phone",
        width: 150,
      },
      {
        title: "Emergency Contact Relation",
        dataIndex: "emergencycontact_relation",
        key: "emergencycontact_relation",
        width: 150,
      },

      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 180,
        render: (text, record) => (
          <Space size="middle" className="px-4 font-semibold">
            <a
              onClick={() => {
                navigate(`/students/edit/`, { state: record });
              }}
            >
              Edit
            </a>
            <a className=" hover:text-red">Delete</a>
          </Space>
        ),
      },
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
            dataSource={query?.data?.data?.message || []} // Fix: Access the 'data' property of the resolved data
            scroll={{ x: 1300 }}
          />
        )}
      </div>
    );
  }
export default StudentTable;