import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
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
  // console.log(query.data?.data?.data)
  const columns: TableColumnsType = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: "Program Type",
      dataIndex: "type",
      key: "type",
      sorter: true,
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
          dataSource={query?.data?.data?.data || []}
          rowKey={(record) => record._id || ""}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record: {
              _id: string;
              courses: CourseFields[];
              description: string;
            }) => {
              return (
                <div className="p-2 bg-white flex gap-20 overflow-y-scroll">
                  <div>
                    <h3 className="font-semibold">Courses</h3>
                    <ul>
                      {record?.courses?.map((course) => (
                        <li key={course._id} className="flex gap-1">
                          <span>&#8226;</span>
                          {course.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p>{record.description}</p>
                  </div>
                </div>
              );
            },
          }}
        />
      )}
    </div>
  );
};

export default CurriculumTable;
