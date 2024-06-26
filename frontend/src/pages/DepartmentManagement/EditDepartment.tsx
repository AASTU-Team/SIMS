import type { FormProps } from "antd";
import {Form, Input,notification} from "antd";
import { DepartmentFields } from "../../type/department";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateDepartment } from "../../api/departmentApi";

export default function EditDepartment() {
  const [form] = Form.useForm();
  const {state}: {state: DepartmentFields} = useLocation();

  const EditDepartmentMutation = useMutation({
    mutationKey: ["editDepartment"],
    mutationFn: (values: DepartmentFields) => updateDepartment(values.name || "",values),
    onError: () => {
      notification.error({ message: "Department Not Updated" });
    },
    onSuccess: () => {
      notification.success({ message: "Department Updated Successfully" });
      form.resetFields();
    },
  });
  
  const onFinish: FormProps<DepartmentFields>["onFinish"] = (values) => {
    EditDepartmentMutation.mutate(values)
  };

  const onFinishFailed: FormProps<DepartmentFields>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-lg text-black dark:text-white">
            Edit Room
          </h3>

          <button
            onClick={() => form.submit()}
            disabled={EditDepartmentMutation.isPending}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            Edit Room
          </button>
        </div>
        <div className="p-7">
          <Form
            name="registration_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelWrap={true}
            form={form}
          >
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<DepartmentFields>
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the department name!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="name"
                  >
                    Department Name
                  </label>
                  <Input
                    placeholder="Enter the department Name"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={state?.name}
                  />
                </div>
              </Form.Item>
              <Form.Item<DepartmentFields>
                name="dep_head"
                rules={[
                  {
                    required: true,
                    message: "Please input the department head!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="head"
                  >
                    Department Head
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the department head"
                    defaultValue={state?.dep_head}
                  />
                </div>
              </Form.Item>
              <Form.Item<DepartmentFields>
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input the description!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <Input.TextArea
                    placeholder="Enter the description"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={state?.description}
                  />
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
