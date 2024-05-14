import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {CurriculumFields} from "../../type/curriculum";
import { useNavigate } from 'react-router-dom';

const data: CurriculumFields[] = [
  {
    name: "Curriculum 1",
    department_id: "Seng",
    credits_required: 120,
    semester: "Spring",
    year: "3",
    courses: ["Course 1", "Course 2", "Course 3"],
    description: "This is the description for Curriculum 1",
  },
  {
    name: "Curriculum 2",
    department_id: "Eeng",
    credits_required: 90,
    semester: "Fall",
    year: "3",
    courses: ["Course 4", "Course 5", "Course 6"],
    description: "This is the description for Curriculum 2",
  },
];

const CurriculumTable: React.FC = () => {
  const navigate = useNavigate();
  const columns: TableColumnsType<CurriculumFields> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "department_id",
      key: "department_id",
      sorter: true,
    },
    {
      title: "Credits Required",
      dataIndex: "credits_required",
      key: "credits_required",
      sorter: true,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      sorter: true,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: true,
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (courses: string[]) => (
        <ul>
          {courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "operation",
      render: (text, record) => (
        <Space size="middle" className="px-4 font-semibold">
          <a
            onClick={() => {
              navigate(`/curriculum/edit/`, { state: record });
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
    <div className="shadow-lg py-4">
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CurriculumTable;
