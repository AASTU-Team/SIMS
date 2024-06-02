import React from 'react';
import { Table, notification, Popconfirm, Switch } from 'antd';
import type { TableColumnsType } from 'antd';
import {StudentFields, StudentDeleteFields} from "../../type/student";
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteStudent, getStudent } from '../../api/student';
import Loader from '../../components/Loader';
import { QuestionCircleOutlined } from '@ant-design/icons';


const StudentTable: React.FC = () =>
  {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: ["student"],
        queryFn: getStudent,
      });
    console.log(query);
    const DeleteStudentMutation = useMutation({
        mutationKey: ["addStudent"],
        mutationFn: (value: StudentDeleteFields) => deleteStudent(value),
        onError: () => {
          notification.error({ message: "Student Not Deleted" });
        },
        onSuccess: () => {
          notification.success({ message: "Student Deleted Successfully" });
          query.refetch();
        },
      });
    
    const ConfirmDelete = (student_id:string, email: string) => {
        DeleteStudentMutation.mutate({student_id,email});
      }
      
  
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
          <div className="flex gap-4 px-4 font-semibold">
            <a
              onClick={() => {
                navigate(`/students/edit/`, { state: record });
              }}
            >
              Edit
            </a>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              onConfirm={() => ConfirmDelete(record._id, record.email)}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <a className=" hover:text-red">Delete</a>
            </Popconfirm>
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked={record.status === "Active"}
              onChange={(checked) => {
                console.log(checked);
              }}/>
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
          />
        )}
      </div>
    );
  }
export default StudentTable;