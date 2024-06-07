import {Form,Input,Modal, notification} from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getWithdrawalStatus, sendReadmissionRequest, sendWithdrawalRequest } from '../../api/student';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import Loader from '../../components/Loader';

const { confirm } = Modal;



export default function WithdrawalReadmission() {
  const [form] = Form.useForm()
  const user = useSelector((state: RootState) => state.user);
  
  const query = useQuery({
    queryKey: ["withDrawlReadmission"],
    queryFn: () => getWithdrawalStatus(user._id),
  });

  const requestWithdrawalMutation = useMutation({
    mutationKey: ["requestWithdrawal"],
    mutationFn: (reason:string) => sendWithdrawalRequest(user._id,reason),
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
    mutationFn: (reason: string) => sendReadmissionRequest(user._id, reason),
    onError: () => {
      notification.error({ message: "Readmission Request Unsuccessful" });
    },
    onSuccess: () => {
      notification.success({ message: "Readmission Request Successfully Sent" });
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
      requestWithdrawalMutation.mutate(
        user._id,
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
          <div className="flex justify-end mr-5">
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
        query?.data?.data?.message?.status === "Registrar-enroll" && (
          <Form
            name="withdrawal_readmission"
            autoComplete="off"
            labelWrap={true}
            form={form}
          >
            <div className="font-medium text-rose-500">You have withdrawn, readmission is open.</div>
            <Form.Item
              name="reason"
              rules={[
                {
                  required: false,
                  message: "Please input the reason for readmission!",
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
                  placeholder="Enter the reason for readmission"
                  rows={10}
                  className=" rounded-lg w-200 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </Form.Item>
            <div className="flex justify-end mr-5">
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
