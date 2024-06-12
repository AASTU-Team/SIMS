import React from 'react';
import { Table, Space, Switch, notification} from 'antd';
import type { TableColumnsType } from 'antd';
import {StaffFields} from "../../type/staff";
import { useNavigate } from 'react-router-dom';
import {  useMutation, useQuery } from '@tanstack/react-query';
import {  getStaff } from '../../api/staff';
import Loader from '../../components/Loader';
import { activateUser, deactivateUser } from '../../api/student';


const StaffTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["staff"],
        queryFn: getStaff,
      });
    console.log(query)
    // const DeleteStaffMutations = useMutation({
    //     mutationKey: ["deleteStaff"],
    //     mutationFn: ({id,email}:{id:string,email:string}) => deleteStaff(id,email),
    //     onError: () => {
    //       notification.error({ message: "Staff Delete Unsuccessfully" });
    //     },
    //     onSuccess: () => {
    //       notification.success({ message: "Staff Deleted Successfully" });
    //       query.refetch()
    //     },
    //   });
   const ActivateUserMutation = useMutation({
     mutationKey: ["activateUser"],
     mutationFn: (email: string) => activateUser(email),
     onError: () => {
       notification.error({ message: "User Not Activated" });
     },
     onSuccess: () => {
       notification.success({ message: "User Activated" });
       query.refetch();
     },
   });
   const DeactivateUserMutation = useMutation({
     mutationKey: ["deactivateUser"],
     mutationFn: (email: string) => deactivateUser(email),
     onError: () => {
       notification.error({ message: "User Not Deactivated" });
     },
     onSuccess: () => {
       notification.success({ message: "User Deactivated" });
       query.refetch();
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
        width: 200,
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
        width: 100,
        render: (text, record) => (
          <Space size="middle" className="px-4 font-semibold">
            <a
              onClick={() => {
                navigate(`/staff/edit/`, { state: record });
              }}
            >
              Edit
            </a>
            {/* <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              okText="Yes"
              cancelText="No"
              onConfirm={()=>DeleteStaffMutations.mutate({id:record?._id || "", email: record?.email || ""})}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <a className=" hover:text-red">Delete</a>
            </Popconfirm> */}
          </Space>
        ),
      },
      // {
      //   title: "Status",
      //   key: "operation",
      //   fixed: "right",
      //   width: 150,
      //   render: (text, record) => (
      //     <div className="flex gap-4 px-4 font-semibold">
      //       <Switch
      //         checkedChildren="Active"
      //         unCheckedChildren="Inactive"
      //         defaultChecked={record.userStatus === "Active"}
      //         onChange={() => {
      //           if (record.userStatus === "Active") {
      //             ActivateUserMutation.mutate(record.email || "");
      //           } else {
      //             ActivateUserMutation.mutate(record.email || "");
      //           }
      //         }}
      //       />
      //     </div>
      //   ),
      // },
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
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    );
  }
export default StaffTable;