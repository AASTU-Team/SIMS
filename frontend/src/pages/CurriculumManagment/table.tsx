import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {CurriculumFields} from "../../type/curriculum";
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useQuery } from '@tanstack/react-query';
import { getCurriculum } from '../../api/curriculum';
import { CourseFields } from '../../type/course';

// const data: CurriculumFields[] = [
//   {
//     name: "Curriculum 1",
//     department_id: "Seng",
//     credits_required: 120,
//     semester: "Spring",
//     year: "3",
//     courses: ["Course 1", "Course 2", "Course 3"],
//     description: "This is the description for Curriculum 1",
//   },
//   {
//     name: "Curriculum 2",
//     department_id: "Eeng",
//     credits_required: 90,
//     semester: "Fall",
//     year: "3",
//     courses: ["Course 4", "Course 5", "Course 6"],
//     description: "This is the description for Curriculum 2",
//   },
// ];

const CurriculumTable: React.FC = () => {
  const navigate = useNavigate();
    const query=useQuery({
    queryKey: ["curriculum"],
    queryFn: getCurriculum
  })
  const columns: TableColumnsType<CurriculumFields> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
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
      render: (courses: CourseFields[]) => (
        <ul>
          {courses.map((course) => (
            <li key={course.code}>{course.name}</li>
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
          dataSource={query?.data?.data?.data || []} 
        />
      )}
    </div>
  );
};

export default CurriculumTable;
