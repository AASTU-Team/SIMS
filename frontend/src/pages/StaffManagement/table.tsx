import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {StaffFields} from "../../type/staff";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../../api/staff';
import Loader from '../../components/Loader';


// const data: StaffFields[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "1234567890",
//     address: "123 Main St",
//     department_id: "Eeng",
//     birthday: "1990-01-01",
//     gender: "Male",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     phone: "9876543210",
//     address: "456 Elm St",
//     department_id: "Seng",
//     birthday: "1995-05-05",
//     gender: "Female",
//   },
// ];

const StaffTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["staff"],
        queryFn: getStaff,
      });
    const columns: TableColumnsType<StaffFields> = [
      {
        title: "Full Name",
        width: 150,
        dataIndex: "name",
        key: "name",
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
        dataIndex: "phone",
        key: "phone",
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
        dataIndex: "department_id",
        key: "department_id",
        width: 150,
      },
      {
        title: "Date of Birth",
        dataIndex: "birthday",
        key: "birthday",
        width: 150,
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
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
                navigate(`/staff/edit/`, { state: record });
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
            dataSource={query?.data?.data?.data || []} // Fix: Access the 'data' property of the resolved data
            scroll={{ x: 1300 }}
          />
        )}
      </div>
    );
  }
export default StaffTable;