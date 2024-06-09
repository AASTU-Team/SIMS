// import { useQuery } from "@tanstack/react-query";
import { Table, Modal, notification } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { useMutation} from "@tanstack/react-query";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {  acceptAddDropReg } from "../../api/student";
const { confirm } = Modal;

export default function AddDropRequestsRegistrar() {
  const router = useNavigate()
  const {
    state,
  }: {
    state: {
      courseToAdd: CourseFields[];
      courseToDrop: CourseFields[];
      year: number;
      semester: number;
      type: string;
      addDrop_id: string;
    };
  } = useLocation();
  console.log("State",state);
  
  const ApproveRequestMuation = useMutation({
    mutationKey: ["approveAddDropRequestDep"],
    mutationFn: () => acceptAddDropReg(state.addDrop_id),
    onError: () => {
      notification.error({ message: "Request Approval Failed" });
    },
    onSuccess: () => {
      Modal.success({
        title: "Request Approval Successful",
        content: "Click the button below to go to back.",
        okText: "Go to Department Request",
        style: { margin: "0 auto" },
        onOk: () => {
          router("/studentReg");
        },
      });
    },
  });
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to approve this request?",
      icon: <ExclamationCircleFilled />,
      content: "Make sure all the details are correct.",
      okText: "Confirm",
      onOk() {
        ApproveRequestMuation.mutate();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };


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
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Lecture Hour",
      dataIndex: "lec",
      key: "lec",
      width: 70,
    },
    {
      title: "Lab. Hour",
      dataIndex: "lab",
      key: "lab",
      width: 70,
    },
    {
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 70,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 70,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 70,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 70,
    },
  ];

  const addDrop: TableColumnsType<CourseFields> = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Lecture Hour",
      dataIndex: "lec",
      key: "lec",
      width: 70,
    },
    {
      title: "Lab. Hour",
      dataIndex: "lab",
      key: "lab",
      width: 70,
    },
    {
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 70,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 70,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 70,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 70,
    }
  ];


  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Dropped Courses</div>
        </div>
        <Table
          columns={columns}
          dataSource={state.courseToDrop}
          scroll={{ x: 1300 }}
          pagination={false}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Added Courses</div>
          
        </div>
        <Table
          columns={addDrop}
          pagination={false}
          dataSource={state.courseToAdd}
          scroll={{ x: 1300 }}
        />
        <div className="flex gap-2 justify-end">
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={showConfirm}
          >
            Approve Request
          </button>
          <button
            className="flex justify-center items-center gap-2 rounded-lg border border-red px-4 py-2 text-red hover:bg-red hover:bg-opacity-10"
            onClick={showConfirm}
          >
            Reject Request
          </button>
        </div>
      </div>
      =
    </div>
  );
}
