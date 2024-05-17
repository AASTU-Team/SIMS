import React from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import {RoomFields} from "../../type/room";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../../api/room';
import Loader from '../../components/Loader';




const RoomTable: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery({
      queryKey: ["room"],
      queryFn: getRooms,
    });
  // console.log(query.data);
  const columns: TableColumnsType<RoomFields> = [
    {
      title: "Number",
      dataIndex: "room_number",
      key: "room_number",
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
      {query.isPending ? (
        <div className='h-auto'>
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          dataSource={query?.data?.data?.rooms || []} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 450 }}
        />
      )}
    </div>
  );
};

export default RoomTable;
