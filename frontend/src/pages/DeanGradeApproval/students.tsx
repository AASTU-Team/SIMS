import {
  Popconfirm,
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
} from "antd";
import type { FormProps, TableColumnsType } from "antd";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { StudentApproval } from "../../type/registration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveGradeByDean,
  bulkApproveGradesByDean,
  rejectGradeByDean,
} from "../../api/grade";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

export default function StudentsList({
  records,
}: {
  records: StudentApproval[];
}) {
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [rejectId, setRejectId] = useState("");

  // const data = [
  //   {
  //     key: "1",
  //     name: "John Brown",
  //     id: "2019-01-01",
  //     grade: "A",
  //     attendance: "90%",
  //   },
  // ];
  //   const query = useQuery({
  //     queryKey: ["studentRegisteredRegistrar"],
  //     queryFn: () => getRegistrationRegistrar(),
  //   });

  const ApproveAllRequestMutation = useMutation({
    mutationKey: ["approveAllGradeRequestDean"],
    mutationFn: (approvalIds: string[]) =>
      bulkApproveGradesByDean(approvalIds, user._id),
    onError: () => {
      notification.error({ message: "Request Not Approved" });
    },
    onSuccess: () => {
      notification.success({ message: "Request Approved" });
      queryClient.refetchQueries({ queryKey: ["getDepartmentGradeRequest"] });
    },
  });

  const ApproveRequestMutation = useMutation({
    mutationKey: ["approveOneGradeRequestDean"],
    mutationFn: (value: string) => approveGradeByDean(value, user._id),
    onError: () => {
      notification.error({ message: "Request Not Approved" });
    },
    onSuccess: () => {
      notification.success({ message: "Request Approved" });
      queryClient.refetchQueries({ queryKey: ["getDepartmentGradeRequest"] });
    },
  });
  const RejectRequestMutation = useMutation({
    mutationKey: ["rejectGradeRequest"],
    mutationFn: ({ gradeId, reason }: { gradeId: string; reason: string }) =>
      rejectGradeByDean(gradeId, user._id, reason),
    onError: () => {
      notification.error({ message: "Request Not Rejected" });
    },
    onSuccess: () => {
      notification.success({ message: "Request Rejected" });
      queryClient.refetchQueries({ queryKey: ["getDepartmentGradeRequest"] });
      form.resetFields();
    },
  });

  const columns: TableColumnsType = [
    {
      title: "Full Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "ID",
      width: 150,
      dataIndex: "student_id",
      key: "student_id",
      sorter: true,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 100,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      width: 70,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (text, record) => (
        <div className="font-semibold flex gap-3">
          <Popconfirm
            title="Approve Request"
            description="Are you sure to approve this request?"
            onConfirm={() =>
              ApproveRequestMutation.mutate(record.grade_id as string)
            }
            okText="Yes"
            cancelText="No"
          >
            <Button>Approve</Button>
          </Popconfirm>

          <Button
            danger
            onClick={() => {
              setOpen(true);
              setRejectId(record.grade_id as string);
            }}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const approveAll = () => {
    const approvalIds = records
      .map((record) => record.grade_id)
      .filter((id) => id !== undefined) as string[];
    ApproveAllRequestMutation.mutate(approvalIds);
  };
  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish: FormProps["onFinish"] = (value) => {
    // console.log(value)
    // console.log(rejectId)
    RejectRequestMutation.mutate({
      gradeId: rejectId,
      reason: value.rejection_reason,
    });
    setRejectId("");
    setOpen(false);
  };

  return (
    <div className="pt-2">
      {/* <div className="flex justify-start mb-2">
        <Popconfirm
          title="Approve All Request"
          description="Are you sure to approve all the request?"
          onConfirm={() => approveAll()}
          okText="Confirm"
          cancelText="No"
        >
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray mb-2 hover:bg-opacity-90 ">
            Approve All Requests
          </button>
        </Popconfirm>
      </div> */}

      <Table columns={columns} dataSource={records} scroll={{ x: 1300 }} />
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={800}
        title="Add Record"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            danger
            type="primary"
            onClick={() => form.submit()}
            className="bg-primary"
          >
            Reject
          </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form
          name="registration rejection"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <div className="w-full">
            <div className="">
              <Form.Item
                name="rejection_reason"
                rules={[
                  {
                    required: true,
                    message: "Please input the reason of rejection!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="rejection_reason"
                  >
                    Rejection Reason
                  </label>
                  <Input.TextArea
                    placeholder="Enter the reason rejection"
                    rows={8}
                    id="rejection_reason"
                    className=" rounded-lg w-full border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
