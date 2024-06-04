import React from 'react';
import { Table} from 'antd';
import type { TableColumnsType } from 'antd';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/Loader';
import { SemesterDetails } from '../../type/registration';
import SemesterOption from './SemesterOption';
import { getSemester } from '../../api/registration';


const SemesterTable: React.FC = () =>
  {
    const query = useQuery({
        queryKey: ["semester"],
        queryFn: getSemester,
      });
    // console.log(query.data?.data?.data)
  
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
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
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
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-2 bg-white">
                  <SemesterOption semester={record} />
                </div>
              ),
            }}
          />
        )}
      </div>
    );
  }
export default SemesterTable;