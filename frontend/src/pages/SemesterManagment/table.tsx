import React from 'react';
import { Table, Space} from 'antd';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import Loader from '../../components/Loader';
import { SemesterDetails } from '../../type/registration';
import SemesterOption from './SemesterOption';

const data = [
  {
    key: '1',
    academic_year: '2021',
    program: 'BSCS',
    batches: ['A', 'B'],
    start_date: '2021-09-01',
    end_date: '2021-12-01',
    status: 'Active',
  },
  {
    key: '2',
    academic_year: '2021',
    program: 'BSIT',
    batches: ['A', 'B'],
    start_date: '2021-09-01',
    end_date: '2021-12-01',
    status: 'Active',
  },
  {
    key: '3',
    academic_year: '2021',
    program: 'BSSE',
    batches: ['A', 'B'],
    start_date: '2021-09-01',
    end_date: '2021-12-01',
    status: 'Active',
  },
];
const SemesterTable: React.FC = () =>
  {
    const navigate = useNavigate();
    // const query = useQuery({
    //     queryKey: ["staff"],
    //     queryFn: getStaff,
    //   });
    // console.log(query.data?.data)
  
    const columns: TableColumnsType<SemesterDetails> = [
      {
        title: "Academic Year",
        width: 150,
        dataIndex: "academic_year",
        key: "academic_year",
        fixed: "left",
        sorter: true,
      },
      {
        title: "Program",
        dataIndex: "program",
        key: "program",
        width: 150,
      },
      {
        title: "Start Date",
        dataIndex: "start_date",
        key: "start_date",
        render: (date: string) => {
          const formattedDate = new Date(date).toISOString().split("T")[0];
          return <span>{formattedDate}</span>;
        },
        width: 150,
      },
      {
        title: "End Date",
        dataIndex: "end_date",
        key: "end_date",
        render: (date: string) => {
          const formattedDate = new Date(date).toISOString().split("T")[0];
          return <span>{formattedDate}</span>;
        },
        width: 150,
      }
    ];
    return (
      <div className="shadow-lg py-4 ">
        {/* {query.isPending ? (
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
        )} */}
        <Table
          columns={columns}
          dataSource={data} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 1300 }}
          expandable={{
            expandedRowRender: () => (
              <div className="p-2 bg-white">
                <SemesterOption />
              </div>
            ),
          }}
        />
      </div>
    );
  }
export default SemesterTable;