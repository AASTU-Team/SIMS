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
import RegistrationSlip from "./RegistrationSlip";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmAllRegistrationRegistrar,
  confirmRegistrationRegistrar,
  getRegistrationRegistrar,
  rejectRegistrationRegistrar,
} from "../../api/registration";
import Loader from "../../components/Loader";
import { RegistrationFields } from "../../type/registration";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

export default function Registration() {
  const [form] = useForm();
  const [rejectId, setRejectId] = useState<string>("");

  const query = useQuery({
    queryKey: ["studentRegisteredRegistrar"],
    queryFn: () => getRegistrationRegistrar(),
  });
  console.log(query);

  const ApproveRequestMutation = useMutation({
    mutationKey: ["approveRequestRegistrar"],
    mutationFn: (id: string) => confirmRegistrationRegistrar(id),
    onError: () => {
      notification.error({ message: "Registration Not Successful" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Successful" });
      query.refetch();
      form.resetFields();
    },
  });
  const ApproveAllRequestMutation = useMutation({
    mutationKey: ["approveAllRequestRegistrar"],
    mutationFn: () => confirmAllRegistrationRegistrar(),
    onError: () => {
      notification.error({ message: "Registration Not Successful" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Successful" });
      query.refetch();
      form.resetFields();
    },
  });
  const RejectRequestMutation = useMutation({
    mutationKey: ["rejectRequestDepartment"],
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectRegistrationRegistrar(id, reason),
    onError: () => {
      notification.error({ message: "Registration Reject Successfully" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Rejected Successfully" });
      query.refetch();
      form.resetFields();
    },
  });
  const onFinish: FormProps["onFinish"] = (values) => {
    // console.log(values,rejectId);

    RejectRequestMutation.mutate({
      id: rejectId,
      reason: values.rejection_reason,
    });
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
      width: 150,
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Program",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 70,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      width: 70,
    },
    {
      title: "Total Credit",
      dataIndex: "total_credit",
      key: "total_credit",
      width: 70,
    },
    {
      title: "Date of Registration",
      dataIndex: "registration_date",
      key: "registration_date",
      render: (date: string) => {
        const d = new Date(date);
        const formattedDate = `${("0" + d.getDate()).slice(-2)}-${(
          "0" +
          (d.getMonth() + 1)
        ).slice(-2)}-${d.getFullYear()}`;
        return <span>{formattedDate}</span>;
      },
      width: 150,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (text, record: RegistrationFields) => (
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
    query.data?.data?.message !== "No pending registrations"
  ) {
    for (let i = 0; i < query.data.data.registrations.length; i++) {
      data.push({
        key: i,
        _id: query.data?.data?.students[i]?._id,
        name: query.data?.data?.students[i]?.name,
        id: query.data?.data?.students[i]?.id,
        type: query.data.data.students[i].type,
        year: query.data.data.registrations[i].year,
        semester: query.data.data.registrations[i].semester,
        total_credit: query.data.data.registrations[i].total_credit,
        registration_date: query.data.data.registrations[i].registration_date,
        courses: query.data.data.registrations[i].courses,
      });
    }
  }

  return (
    <div className="pt-2">
      <div className="flex justify-end">
        <Popconfirm
          title="Approve All Request"
          description="Are you sure to approve all the request?"
          onConfirm={() => ApproveAllRequestMutation.mutate()}
          okText="Confirm"
          cancelText="No"
        >
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray mb-2 hover:bg-opacity-90 ">
            Approve All Requests
          </button>
        </Popconfirm>
      </div>
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
            expandedRowRender: (record: RegistrationFields) => (
              <div className="p-1 bg-white">
                <RegistrationSlip details={record.courses} />
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
