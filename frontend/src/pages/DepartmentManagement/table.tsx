import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {DepartmentFields} from "../../type/department";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDepartment } from '../../api/departmentApi';
import Loader from '../../components/Loader';
import { StaffFields } from '../../type/staff';




const DepartmentTable: React.FC = () => {
  const navigate = useNavigate();
  // const [tableData, setTableData] = React.useState<DepartmentFields[]>([]);
  const query=useQuery({
    queryKey: ["department"],
    queryFn: getDepartment
  });
  // console.log(query.data)
  
  const columns: TableColumnsType<DepartmentFields> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => (a.name ?? '').localeCompare(b.name ?? ''),
    },
    {
      title: "Department Head",
      dataIndex: "dep_head",
      key: "dep_head",
      width: 150,
      sorter: true,
      render: (dep_head: StaffFields) => <span>{dep_head?.name}</span>,
    },
    {
      title: "Head Email",
      width: 150,
      sorter: true,
      render: (record) => <span>{record?.dep_head?.email}</span>,
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
              navigate(`/department/edit/`, { state: record });
            }}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="shadow-lg py-4 ">
      {query.isPending ? (
        <div className='h-auto'>
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          pagination={{ pageSize: 5 }}
          dataSource={query?.data?.data?.data || []} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 450 }}
        />
      )}
    </div>
  );
};

export default DepartmentTable;
