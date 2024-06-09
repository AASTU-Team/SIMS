import type { FormProps } from "antd";
import {  Form, Input, Select, DatePicker } from "antd";
import {  UserOutlined } from "@ant-design/icons";
import { StaffFields } from "../../type/staff";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function EdditStaff() {
  const [form] = Form.useForm();
  const {state}: {state: StaffFields} = useLocation();
  console.log(state)
  useEffect(() => {
    if (state) {
      form.setFieldsValue(state);
    }
  }, [form, state]);
  
  const onFinish: FormProps<StaffFields>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<StaffFields>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-lg text-black dark:text-white">
            Edit Staff
          </h3>

          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90">
            <UserOutlined />
            Edit Staff
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
              <Form.Item<StaffFields>
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the full name!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <Input
                  placeholder="Enter the full name"
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  defaultValue={state?.name}
                />
              </Form.Item>
              <Form.Item<StaffFields>
                name="email"
                rules={[{ required: true, message: "Please input the email!" }]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  type="email"
                  placeholder="Enter the email"
                  defaultValue={state?.email}
                />
              </Form.Item>
              <Form.Item<StaffFields>
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input the phone number!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the phone number"
                  defaultValue={state?.phone}
                />
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StaffFields>
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input the address!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="address"
                >
                  Address
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the address"
                  defaultValue={state?.address}
                />
              </Form.Item>
              <Form.Item<StaffFields>
                name="department_id"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one role!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="department_id"
                >
                  Department
                </label>
                <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                  <Select
                    showSearch
                    placeholder="Select Department"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    defaultValue={state?.department_id}
                    options={[
                      {
                        value: "Seng",
                        label: "Software Engineering",
                      },
                      {
                        value: "Eeng",
                        label: "Electrical Engineering",
                      },
                      {
                        value: "Ceng",
                        label: "Civil Engineering",
                      },
                    ]}
                  />
                </div>
              </Form.Item>
              <Form.Item<StaffFields>
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: "Please input the Date of Birth!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="admission_date"
                >
                  Date of Birth
                </label>
                <DatePicker className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StaffFields>
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one role!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="department_id"
                >
                  Staff Role
                </label>
                <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                  <Select
                    showSearch
                    placeholder="Select staff permissions"
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={[
                      {
                        value: "studentMan",
                        label: "Student Management",
                      },
                      {
                        value: "staffMan",
                        label: "Staff Management",
                      },
                      {
                        value: "courseMan",
                        label: "Course Management",
                      },
                      {
                        value: "roomMan",
                        label: "Room Management",
                      },
                      {
                        value: "curriculumMan",
                        label: "Curriculum Management",
                      },
                      {
                        value: "attendance",
                        label: "Student Attendance",
                      },
                      {
                        value: "departmentMan",
                        label: "Department Management",
                      },
                      {
                        value: "studentGrade",
                        label: "Student Grade Management",
                      },
                      {
                        value: "depGradeManagement",
                        label: "Department Grade Management",
                      },
                      {
                        value: "deanGradeManagement",
                        label: "Dean Grade Management",
                      },
                      {
                        value: "semesterMan",
                        label: "Semester Management",
                      },
                      {
                        value: "studentDepReg",
                        label: "Department Office",
                      },
                      {
                        value: "studentReg",
                        label: "Registrar Office",
                      },
                    ]}
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
