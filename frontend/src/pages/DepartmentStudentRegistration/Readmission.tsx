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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";
import { RegistrationFields } from "../../type/registration";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { acceptReadmissionRequestsDep, getDepartmentReadmission, rejectReadmissionRequestsDep } from "../../api/registration";

export default function Readmission() {
  const user = useSelector((state: RootState) => state.user);
  const [form] = useForm();
  const [rejectId,setRejectId] = useState<string>("")

  const query = useQuery({
    queryKey: ["studentReadDepartment"],
    queryFn: () => getDepartmentReadmission(user.department),
  });
  console.log(query);

  const ApproveRequestMutation = useMutation({
    mutationKey: ["approveReadDepartment"],
    mutationFn: (id: string) => acceptReadmissionRequestsDep(id),
    onError: () => {
      notification.error({ message: "Request Not Approved" });
    },
    onSuccess: () => {
      notification.success({ message: "Request Approved" });
      query.refetch();
      form.resetFields();
    },
  });
  const RejectRequestMutation = useMutation({
    mutationKey: ["rejectReadDep"],
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectReadmissionRequestsDep(id, reason),
    onError: () => {
      notification.error({ message: "Request Reject Unsuccessfully" });
    },
    onSuccess: () => {
      notification.success({ message: "Request Rejected Successfully" });
      query.refetch();
      form.resetFields();
    },
  });
  const onFinish: FormProps["onFinish"] = (values) => {
    // console.log(values,rejectId);

    RejectRequestMutation.mutate({id:rejectId,reason:values.rejection_reason})
    form.resetFields();
    setOpen(false);
  };
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
      width: 100,
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (text, record:RegistrationFields) => (
        <div className="font-semibold flex gap-3">
          <Popconfirm
            title="Approve Request"
            description="Are you sure to approve this request?"
            onConfirm={() => ApproveRequestMutation.mutate(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Approve</Button>
          </Popconfirm>

          <Button
            danger
            onClick={() => {
              setRejectId(record._id);
              setOpen(true);
            }}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const data: RegistrationFields[] = [];
  const [open, setOpen] = useState(false);
  if (
    query.isSuccess &&
    query.data?.data?.requests
  ) {
    for (let i = 0; i < (query.data?.data?.requests?.length || 0); i++) {
      data.push({
        key: i,
        _id: query.data?.data?.requests[i]?.stud_id?._id,
        name: query.data?.data?.requests[i]?.stud_id?.name,
        id: query.data?.data?.requests[i]?.stud_id?.id,
        email: query.data?.data?.requests[i]?.stud_id?.email,
        phone: query.data?.data?.requests[i]?.stud_id?.phone,
        reason: query.data?.data?.requests[i]?.reason,
      });
    }
  }

  return (
    <div className="pt-2">
      {query.isPending ? (
        <div className="">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          dataSource={data || []}
          scroll={{ x: 1300 }}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <h3 className="font-semibold">Reason of Withdrawal</h3>
                <p>{record.reason}</p>
              </div>
            ),
          }}
        />
      )}
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
