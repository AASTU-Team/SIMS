import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {CourseFields} from "../../type/course";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '../../api/course';
import Loader from '../../components/Loader';


const CourseTable: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery({
      queryKey: ["course"],
      queryFn: getCourse,
    });
  // console.log(query)
  const columns: TableColumnsType = [
    {
      title: "Course Name",
      width: 250,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      width: 250,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 150,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 100,
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
              navigate(`/course/edit/`, { state: record });
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
          dataSource={query?.data?.data?.data || []} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 1300 }}
          rowKey={(record) => record._id || ""}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record: CourseFields) => {
              return (
                <div className="p-2 bg-white flex gap-20 overflow-y-scroll">
                  {record?.prerequisites?.length ? (
                    <div>
                      <h3 className="font-semibold">Prerequisites</h3>
                      <ul>
                        {record?.prerequisites?.map((course) => (
                          <li key={course._id} className="flex gap-1">
                            <span key={course._id}>&#8226;</span>
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold">Prerequisites</h3>
                      <ul>
                        <li key="no_preq" className="flex gap-1">
                          <span key="no_preq">&#8226;</span>
                          No Prerequisites
                        </li>
                      </ul>
                    </div>
                  )}
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

export default CourseTable;

