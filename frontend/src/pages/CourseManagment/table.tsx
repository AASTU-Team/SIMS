import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {CourseFields} from "../../type/course";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '../../api/course';
import Loader from '../../components/Loader';

// const data: CourseFields[] = [
//   {
//     name: "Course 1",
//     department_id: "Dept 1",
//     credits: 3,
//     prerequisites: ["SWEG103", "SWEG102"],
//     type: "Type 1",
//     code: "Code 1",
//     lec: "Lecture 1",
//     lab: "Lab 1",
//     description: "Description 1",
//   },
//   {
//     name: "Course 2",
//     department_id: "Dept 2",
//     credits: 4,
//     prerequisites: ["SWEG101", "SWEG102"],
//     type: "Type 2",
//     code: "Code 2",
//     lec: "Lecture 2",
//     lab: "Lab 2",
//     description: "Description 2",
//   },
// ];

const CourseTable: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery({
      queryKey: ["course"],
      queryFn: getCourse,
    });
  const columns: TableColumnsType<CourseFields> = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "department_id",
      key: "department_id",
      width: 150,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 150,
    },
    {
      title: "Prerequisites",
      dataIndex: "prerequisites",
      key: "prerequisites",
      width: 150,
      render: (prerequisites: string[]) => 
          {return prerequisites.length > 0 ? (
            <ul>
              {prerequisites.map((prerequisite) => (
                <li key={prerequisite}>{prerequisite}</li>
              ))}
            </ul>
          ) : (
            <p>No Prerequisites</p>
          )
        }
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Lecture",
      dataIndex: "lec",
      key: "lec",
      width: 150,
    },
    {
      title: "Lab",
      dataIndex: "lab",
      key: "lab",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
              navigate(`/courses/edit/`, { state: record });
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
        <div className='h-auto'>
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
};

export default CourseTable;

