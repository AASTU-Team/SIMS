import {Form,Input,Modal, notification, Upload,message,Button} from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getWithdrawalStatus, sendReadmissionRequest, sendWithdrawalRequest } from '../../api/student';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import Loader from '../../components/Loader';
import { UploadOutlined,DeleteOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useState } from 'react';
const { confirm } = Modal;



export default function WithdrawalReadmission() {
  const [form] = Form.useForm()
  const user = useSelector((state: RootState) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const query = useQuery({
    queryKey: ["withDrawlReadmission"],
    queryFn: () => getWithdrawalStatus(user._id),
  });

  const requestWithdrawalMutation = useMutation({
    mutationKey: ["requestWithdrawal"],
    mutationFn: (reason:string) => sendWithdrawalRequest(user._id,reason,file),
    onError: () => {
      notification.error({ message: "Withdrawal Request Unsuccessful" });
    },
    onSuccess: () => {
      notification.success({ message: "Withdrawal Request Successfully Sent" });
      query.refetch()
    },
  });

  const requestReadmissionMutation = useMutation({
    mutationKey: ["requestReaddrawal"],
    mutationFn: (reason: string) => sendReadmissionRequest(user._id, reason,file),
    onError: () => {
      notification.error({ message: "Readmission Request Unsuccessful" });
    },
    onSuccess: () => {
      notification.success({ message: "Readmission Request Successfully Sent" });
      setFile(null)
      query.refetch();
    },
  });
const showReadmissionConfirm = () => {
  confirm({
    title: "Are you sure you want to send a request?",
    icon: <ExclamationCircleFilled />,
    content: "Make sure this step is irreversible.",
    okText: "I'm sure.",
    onOk() {
      // console.log(form.getFieldValue("reason"))
      requestReadmissionMutation.mutate(
        form.getFieldValue("reason") || ""
      );
      query.refetch();
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to send a request?",
      icon: <ExclamationCircleFilled />,
      content:
        "Make sure this step is irreversible.",
      okText:"I'm sure.",
      onOk() {
        // console.log(form.getFieldValue("reason"))
        requestWithdrawalMutation.mutate(
          user._id,
          form.getFieldValue("reason") || ""
        );
        query.refetch()
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  console.log(query)
  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const isSizeValid = file.size / 1024 / 1024 < 10; // Check if file size is less than 10MB
      if (!isPDF) {
        message.error(`${file.name} is not a PDF file`);
      }
      if (!isSizeValid) {
        message.error(`${file.name} is larger than 10MB`);
      }
      return (isPDF && isSizeValid) || Upload.LIST_IGNORE;
    },
    customRequest: ({ file }) => {
      console.log(file);
      if (file) {
        const fileObj = file as File;
        setFile(fileObj); // Set the file to the file state
      }
    },
    showUploadList: false,
  };
  return (
    <div className="pt-1 flex flex-col gap-5">
      {query.isPending ? (
        <div className="">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : query?.data?.data?.message === false ? (
        <Form
          name="withdrawal_readmission"
          autoComplete="off"
          labelWrap={true}
          form={form}
        >
          <Form.Item
            name="reason"
            rules={[
              {
                required: false,
                message: "Please input the reason for withdrawal!",
              },
            ]}
          >
            <div>
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="reason"
              >
                Reason For Withdrawal
              </label>
              <Input.TextArea
                placeholder="Enter the reason for withdrawal"
                rows={10}
                className=" rounded-lg w-200 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </Form.Item>
          <div className="flex flex-col justify-end mr-5 gap-4 items-end">
            {file ? (
              <div className="flex gap-5 font-medium text-[15px]">
                Attached Document:
                <span className="text-blue-900"> {file?.name}</span>
                <DeleteOutlined
                  className="text-red"
                  onClick={() => setFile(null)}
                />
              </div>
            ) : (
              <Upload {...props}>
                <Button
                  className="py-2 flex justify-center align-middle items-center"
                  icon={<UploadOutlined />}
                >
                  Upload Addition Documents (&lt;10MB)
                </Button>
              </Upload>
            )}
            <button
              className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray  hover:bg-opacity-90"
              onClick={showConfirm}
            >
              Submit Withdrawal Request
            </button>
          </div>
        </Form>
      ) : query?.data?.data?.message?.status === "Student-Withdrawal" ? (
        <div className="font-medium">
          Your request is being processed by your department.
        </div>
      ) : query?.data?.data?.message?.status === "Department-Withdrawal" ? (
        <div className="font-medium">
          Your registration is being processed by the Registrar Office.
        </div>
      ) : (
        query?.data?.data?.message?.status === "Registrar-withdrawal" && (
          <Form
            name="withdrawal_readmission"
            autoComplete="off"
            labelWrap={true}
            form={form}
          >
            <div className="font-medium text-rose-500">
              You have withdrawn, readmission is open.
            </div>
            <Form.Item
              name="reason"
              rules={[
                {
                  required: false,
                  message: "Please input the reason for withdrawal!",
                },
              ]}
            >
              <div>
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="reason"
                >
                  Reason For Readmission
                </label>
                <Input.TextArea
                  placeholder="Enter the reason for withdrawal"
                  rows={10}
                  className=" rounded-lg w-200 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </Form.Item>
            <div className="flex flex-col justify-end mr-5 gap-4 items-end">
              {file ? (
                <div className="flex gap-5 font-medium text-[15px]">
                  Attached Document:
                  <span className="text-blue-900"> {file?.name}</span>
                  <DeleteOutlined
                    className="text-red"
                    onClick={() => setFile(null)}
                  />
                </div>
              ) : (
                <Upload {...props}>
                  <Button
                    className="py-2 flex justify-center align-middle items-center"
                    icon={<UploadOutlined />}
                  >
                    Upload Additional Documents (&lt;10MB)
                  </Button>
                </Upload>
              )}
              <button
                className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray  hover:bg-opacity-90"
                onClick={showReadmissionConfirm}
              >
                Submit Readmission Request
              </button>
            </div>
          </Form>
        )
      )}
    </div>
  );
}
