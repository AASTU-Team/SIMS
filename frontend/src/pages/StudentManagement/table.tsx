import React from 'react';
import { Table, Switch, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import {StudentFields} from "../../type/student";
import { useNavigate } from 'react-router-dom';
import {  useMutation, useQuery } from '@tanstack/react-query';
import {  activateUser, deactivateUser, getStudent } from '../../api/student';
import Loader from '../../components/Loader';
// import { QuestionCircleOutlined } from '@ant-design/icons';


const StudentTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["student"],
        queryFn: getStudent,
      });
    console.log(query?.data?.data);
    const ActivateUserMutation = useMutation({
        mutationKey: ["activateUser"],
        mutationFn: (email:string) => activateUser(email),
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
    
    // const ConfirmDelete = (student_id:string, email: string) => {
    //     DeleteStudentMutation.mutate({student_id,email});
    //   }
      
  
    const columns: TableColumnsType<StudentFields> = [
      {
        title: "Full Name",
        width: 150,
        dataIndex: "name",
        key: "name",
        fixed: "left",
        sorter: (a, b) => a.name.localeCompare(b.name),
        
      },
      {
        title: "ID",
        width: 150,
        dataIndex: "id",
        key: "id",
        fixed: "left",
        sorter: (a, b) => a.name.localeCompare(b.name),
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
        width: 200,
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
        width: 150,
        filters: [
          {
            text: "1",
            value: 1,
          },
          {
            text: "2",
            value: 2,
          },
          {
            text: "3",
            value: 3,
          },
          {
            text: "4",
            value: 4,
          },
          {
            text: "5",
            value: 5,
          },
        ],
      },
      {
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
        width: 150,
        filters: [
          {
            text: "1",
            value: 1,
          },
          {
            text: "2",
            value: 2,
          },
          {
            text: "3",
            value: 3,
          },
        ],
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
        width: 100,
        render: (text, record) => (
          <div className="flex gap-4 px-4 font-semibold">
            <a
              onClick={() => {
                navigate(`/students/edit/`, { state: record });
              }}
            >
              Edit
            </a>
            {/* <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              onConfirm={() => ConfirmDelete(record._id, record.email)}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <a className=" hover:text-red">Delete</a>
            </Popconfirm> */}
          </div>
        ),
      },
      {
        title: "Status",
        key: "operation",
        fixed: "right",
        width: 150,
        render: (text, record) => (
          <div className="flex gap-4 px-4 font-semibold">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked={record.userStatus === "Active"}
              onChange={() => {
                if(record.userStatus === "Active"){
                  DeactivateUserMutation.mutate(record.email || "")
                }else{
                  ActivateUserMutation.mutate(record.email || "")
                }

              }}
            />
          </div>
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
            pagination={{ pageSize: 6 }}
          />
        )}
      </div>
    );
  }
export default StudentTable;