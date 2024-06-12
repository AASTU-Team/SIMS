import type { FormProps } from "antd";
import {Form, Input,notification, Select} from "antd";
import { DepartmentFields } from "../../type/department";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateDepartment } from "../../api/departmentApi";
import { getStaff } from "../../api/staff";
import { StaffFields } from "../../type/staff";
import { useEffect } from "react";

export default function EditDepartment() {
  const [form] = Form.useForm();
  const {state}: {state: DepartmentFields} = useLocation();
    useEffect(() => {
      if (state) {
        form.setFieldsValue(state);
      }
    }, [form, state]);

    const staffQuery = useQuery({
      queryKey: ["staff"],
      queryFn: () => getStaff(),
    });

  const EditDepartmentMutation = useMutation({
    mutationKey: ["editDepartment"],
    mutationFn: (values: DepartmentFields) => updateDepartment(values),
    onError: () => {
      notification.error({ message: "Department Not Updated" });
    },
    onSuccess: () => {
      notification.success({ message: "Department Updated Successfully" });
      // form.resetFields();
    },
  });
  
  const onFinish: FormProps<DepartmentFields>["onFinish"] = (values) => {
    values._id = state._id;
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
            Edit Department
          </h3>

          <button
            onClick={() => form.submit()}
            disabled={EditDepartmentMutation.isPending}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            Edit Department
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
                    name="name"
                    defaultValue={state.name}
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder={
                        staffQuery.isLoading
                          ? "Fetching Staff Members"
                          : "Select Department Head"
                      }
                      optionFilterProp="children"
                      onChange={(value) => {
                        form.setFieldValue("dep_head", value);
                      }}
                      disabled={staffQuery.isLoading}
                      defaultValue={state.dep_head?._id}
                      options={
                        staffQuery.isFetched
                          ? staffQuery.data?.data?.message?.map(
                              (value: StaffFields) => {
                                return {
                                  value: value._id,
                                  label: value.name,
                                };
                              }
                            )
                          : []
                      }
                    />
                  </div>
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
                    defaultValue={state.description}
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
