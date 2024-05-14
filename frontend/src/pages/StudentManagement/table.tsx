import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {StudentFields} from "../../type/student";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudent } from '../../api/student';
import Loader from '../../components/Loader';





// const data: StudentFields[] = [
// {
//   id: "ETS0660/12",
//   name: "John Doe",
//   email: "johndoe@example.com",
//   contact: "1234567890",
//   address: "123 Main St",
//   department_id: "Seng",
//   year: 3,
//   admission_date: "2022-01-01",
//   emergencycontact_name: "Jane Doe",
//   emergencycontact_phone: "9876543210",
//   emergencycontact_relation: "Spouse",
// },
// {
//   id: "ETS0678/12",
//   name: "Jane Smith",
//   email: "janesmith@example.com",
//   contact: "0987654321",
//   address: "456 Elm St",
//   department_id: "Eeng",
//   year: 2,
//   admission_date: "2021-09-15",
//   emergencycontact_name: "John Smith",
//   emergencycontact_phone: "1234567890",
//   emergencycontact_relation: "Parent",
// }
// ];

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
        title: "Year",
        dataIndex: "year",
        key: "year",
        width: 150,
      },
      {
        title: "Admission Date",
        dataIndex: "admission_date",
        key: "admission_date",
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
            <a onClick={()=>{
              navigate(`/students/edit/`, {state: record})
            }}>Edit</a>
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
export default StudentTable;