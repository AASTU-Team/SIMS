import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {RoomFields} from "../../type/room";
import { useNavigate } from 'react-router-dom';



const data: RoomFields[] = [
  {
    number: 101,
    block: "A",
    type: "Lecture",
  },
  {
    number: 102,
    block: "B",
    type: "Lab",
  },
];

const RoomTable: React.FC = () => {
  const navigate = useNavigate();
  const columns: TableColumnsType<RoomFields> = [
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      width: 150,
      sorter: true,
    },
    {
      title: "Block",
      dataIndex: "block",
      key: "block",
      width: 150,
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      sorter: true,
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
              navigate(`/rooms/edit/`, { state: record });
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
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 450 }}
      />
    </div>
  );
};

export default RoomTable;
