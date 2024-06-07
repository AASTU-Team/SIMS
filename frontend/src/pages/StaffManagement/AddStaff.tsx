import type { FormProps } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import {  Form, Input, Select, DatePicker, notification } from "antd";
import { StaffFields } from "../../type/staff";
import { useMutation, useQuery } from "@tanstack/react-query";
import { registerStaff } from "../../api/staff";
import { getDepartment } from "../../api/departmentApi";
import { DepartmentFields } from "../../type/department";

export default function AddStaff() {
  const [form] = Form.useForm();

    const departmentQuery = useQuery({
      queryKey: ["department"],
      queryFn: getDepartment,
    });

  const AddStaffMutation = useMutation({
       mutationKey: ["addStaff"],
       mutationFn: (values: StaffFields) => registerStaff(values),
       onError: () => {
         notification.error({ message: "Staff Not Registered" });
       },
       onSuccess: () => {
         notification.success({ message: "Staff Registered Successfully" });
         form.resetFields();
       },
     });
  
  const onFinish: FormProps<StaffFields>["onFinish"] = (values) => {
    console.log(values)
    AddStaffMutation.mutate(values);
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
            Register Staff
          </h3>

          <button
            onClick={() => form.submit()}
            disabled={AddStaffMutation.isPending}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            {AddStaffMutation.isPending ? (
              <div className="flex items-center justify-center bg-transparent">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
              </div>
            ) : (
              <UserAddOutlined />
            )}
            Register Staff
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
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter the full name"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<StaffFields>
                name="email"
                rules={[{ required: true, message: "Please input the email!" }]}
              >
                <div>
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
                  />
                </div>
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
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the phone number"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StaffFields>
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select the gender!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select gender"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("gender", value);
                      }}
                      options={[
                        {
                          value: "FEMALE",
                          label: "Female",
                        },
                        {
                          value: "MALE",
                          label: "Male",
                        },
                      ]}
                    />
                  </div>
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
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="birthday"
                  >
                    Date of Birth
                  </label>
                  <DatePicker
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("birthday", date);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item<StaffFields>
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input the address!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the address"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StaffFields>
                name="department_id"
                rules={[
                  {
                    required: true,
                    message: "Please select the department!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="department_id"
                  >
                    Department
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder={
                        departmentQuery.isLoading
                          ? "Fetching Departments"
                          : "Select Department"
                      }
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("department_id", value);
                      }}
                      disabled={departmentQuery.isLoading}
                      options={
                        departmentQuery.isFetched
                          ? departmentQuery.data?.data?.data?.map(
                              (value: DepartmentFields) => {
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
              <Form.Item<StaffFields>
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one role!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="role"
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
                      onChange={(value) => {
                        form.setFieldValue("role", value);
                      }}
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
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
