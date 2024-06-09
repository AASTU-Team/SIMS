import React from 'react';
import { Table, Space, Switch, Popconfirm, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import {StaffFields} from "../../type/staff";
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteStaff, getStaff } from '../../api/staff';
import Loader from '../../components/Loader';
import { QuestionCircleOutlined } from "@ant-design/icons";


const StaffTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["staff"],
        queryFn: getStaff,
      });
    const DeleteStaffMutations = useMutation({
        mutationKey: ["deleteStaff"],
        mutationFn: ({id,email}:{id:string,email:string}) => deleteStaff(id,email),
        onError: () => {
          notification.error({ message: "Staff Delete Unsuccessfully" });
        },
        onSuccess: () => {
          notification.success({ message: "Staff Deleted Successfully" });
          query.refetch()
        },
      });

    
    // console.log(query.data?.data)
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
        dataIndex: "department_name",
        key: "department_name",
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
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        width: 150,
      },

      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: 200,
        render: (text, record) => (
          <Space size="middle" className="px-4 font-semibold">
            <a
              onClick={() => {
                navigate(`/staff/edit/`, { state: record });
              }}
            >
              Edit
            </a>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>DeleteStaffMutations.mutate({id:record?._id || "", email: record?.email || ""})}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <a className=" hover:text-red">Delete</a>
            </Popconfirm>
            <Switch
              defaultChecked={record.status === "Active"}
              onChange={(checked) => {
                console.log(checked);
              }}
            />
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
            scroll={{ x: 1000 }}
          />
        )}
      </div>
    );
  }
export default StaffTable;