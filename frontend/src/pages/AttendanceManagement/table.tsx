import React from 'react';
import { Table} from 'antd';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/Loader';
import { getSemester } from '../../api/registration';
import type { TableColumnsType } from "antd";



const AttendanceTable: React.FC<{ columns: TableColumnsType }> = ({ columns }) =>
  {
    const query = useQuery({
        queryKey: ["semester"],
        queryFn: getSemester,
      });
    console.log(query?.data?.data)
  
    
    return (
      <div className="shadow-lg py-4 ">
        {query.isPending ? (
          <div className="h-auto">
            <Loader />
          </div>
        ) : query.isError ? (
          <>{`${query.error}`}</>
        ) : (
          <div className="">
            <Table
              columns={columns}
              dataSource={query?.data?.data?.data || []} // Fix: Access the 'data' property of the resolved data
              scroll={{ x: 1300 }}
            />
          </div>
        )}
      </div>
    );
  }
export default AttendanceTable;