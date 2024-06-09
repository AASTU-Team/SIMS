import {
  Popconfirm,
  Table,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import type { FormProps, TableColumnsType } from "antd";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

export default function StudentsList() {
  const [open,setOpen] = useState(false)
  const [form] = useForm();
  const data = [
    {
      key: "1",
      name: "John Brown",
      id: "2019-01-01",
      grade: "A",
      attendance: "90%",
    },
  ];
//   const query = useQuery({
//     queryKey: ["studentRegisteredRegistrar"],
//     queryFn: () => getRegistrationRegistrar(),
//   });

//   const ApproveAllRequestMutation = useMutation({
//     mutationKey: ["approveAllRequestRegistrar"],
//     mutationFn: () => confirmAllRegistrationRegistrar(),
//     onError: () => {
//       notification.error({ message: "Registration Not Successful" });
//     },
//     onSuccess: () => {
//       notification.success({ message: "Registration Successful" });
//       query.refetch();
//       form.resetFields();
//     },
//   });

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
      render: () => (
        <div className="font-semibold flex gap-3">
          <Popconfirm
            title="Approve Request"
            description="Are you sure to approve this request?"
            onConfirm={() => console.log("approved")}
            okText="Yes"
            cancelText="No"
          >
            <Button>Approve</Button>
          </Popconfirm>

          <Button
            danger
            onClick={() => {
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

    const onFinish: FormProps["onFinish"] = (value) => {
      console.log("Success:", value);
    };

  return (
    <div className="pt-2">
      <div className="flex justify-start">
        <Popconfirm
          title="Approve All Request"
          description="Are you sure to approve all the request?"
          onConfirm={() => console.log("approve all")}
          okText="Confirm"
          cancelText="No"
        >
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray mb-2 hover:bg-opacity-90 ">
            Approve All Requests
          </button>
        </Popconfirm>
      </div>
      {/* {query.isPending ? (
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
      )} */}
      <Table
        columns={columns}
        dataSource={ data}
        scroll={{ x: 1300 }}
        
      />
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
