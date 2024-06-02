import {Form,Input,Modal} from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const showConfirm = () => {
  confirm({
    title: "Are you sure you want to register?",
    icon: <ExclamationCircleFilled />,
    content:
      "Make sure all the details are correct. Any problems can be addressed at the registrar office.",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};


export default function WithdrawalReadmission() {
  return (
    <div className="flex flex-col gap-10 border-1 shadow-3 rounded-md p-5">
      <div className="flex justify-start text-title-md">
        Withdrawal and Readmission
      </div>
      <Form name="withdrawal_readmission" autoComplete="off" labelWrap={true}>
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
    </div>
  );
}
