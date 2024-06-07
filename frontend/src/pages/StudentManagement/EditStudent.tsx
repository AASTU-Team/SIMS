import type { FormProps } from "antd";
import { Button, Form, Input, Select, Upload, DatePicker, notification } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { StudentFields } from "../../type/student";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDepartment } from "../../api/departmentApi";
import { DepartmentFields } from "../../type/department";
import { updateStudent } from "../../api/student";
import dayjs from "dayjs";

export default function EditStudent() {
  const [form] = Form.useForm();
  const departmentQuery = useQuery({
    queryKey: ["department"],
    queryFn: getDepartment,
  });

  const {state}: {state: StudentFields} = useLocation();
  const [formValue, setFormValue] = useState<StudentFields>(state);
  // console.log(state)
  useEffect(() => {
    if (state) {
      form.setFieldsValue(state);
    }
  }, [form, state]);

  const EditStudentMutation = useMutation({
      mutationKey: ["editStudent"],
      mutationFn: (values: StudentFields) => updateStudent(values),
      onError: () => {
        notification.error({ message: "Student Not Updated" });
      },
      onSuccess: () => {
        notification.success({ message: "Student Updated Successfully" });
      },
    });
  
  const onFinish: FormProps<StudentFields>["onFinish"] = (values) => {
    values._id=state._id;
    setFormValue(values);
    console.log("Success:", values);
    EditStudentMutation.mutate(values);
  };

  const onFinishFailed: FormProps<StudentFields>["onFinishFailed"] = (
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
            Edit Student
          </h3>

          <button
            onClick={() => form.submit()}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            {EditStudentMutation.isPending ? (
              <div className="flex items-center justify-center bg-transparent">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
              </div>
            ) : (
              <UserOutlined />
            )}
            Edit User
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
              <Form.Item<StudentFields>
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
                    defaultValue={formValue?.name}
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
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
                    defaultValue={formValue?.email}
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="id"
                rules={[{ required: true, message: "Please input the ID!" }]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="id"
                  >
                    ID
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the ID"
                    defaultValue={formValue?.id}
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
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
                      defaultValue={formValue.gender}
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
              <Form.Item<StudentFields>
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
                    defaultValue={dayjs(formValue.birthday)}
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("birthday", date);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
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
                    defaultValue={formValue.phone}
                    placeholder="Enter the phone number"
                  />
                </div>
              </Form.Item>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input the student's address!",
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
                    defaultValue={formValue.address}
                    placeholder="Enter the address"
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="year"
                rules={[
                  {
                    required: true,
                    message: "Please select the year!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="year"
                  >
                    Batch Year
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select year"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("year", value);
                      }}
                      defaultValue={formValue.year}
                      options={[
                        {
                          value: "1",
                          label: "First Year",
                        },
                        {
                          value: "2",
                          label: "Second Year",
                        },
                        {
                          value: "3",
                          label: "Third Year",
                        },
                        {
                          value: "4",
                          label: "Fourth Year",
                        },
                        {
                          value: "5",
                          label: "Fifth Year",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="semester"
                rules={[
                  {
                    required: true,
                    message: "Please select the semester!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="semester"
                  >
                    Semester
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select semester"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("semester", value);
                      }}
                      defaultValue={formValue.semester}
                      options={[
                        {
                          value: "1",
                          label: "First Semester",
                        },
                        {
                          value: "2",
                          label: "Second Semester",
                        },
                        {
                          value: "3",
                          label: "Third Semester",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
                name="emergencycontact_name"
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
                    htmlFor="emergencycontact_name"
                  >
                    Emergency Contact Full Name
                  </label>

                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={formValue.emergencycontact_name}
                    placeholder="Enter the full name"
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="emergencycontact_phone"
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
                    htmlFor="emergencycontact_phone"
                  >
                    Emergency Contact Phone Number
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={formValue.emergencycontact_phone}
                    placeholder="Enter the phone number"
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="emergencycontact_relation"
                rules={[
                  { required: true, message: "Please input the relation!" },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emergencycontact_relation"
                  >
                    Emergency Contact Relations
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={formValue.emergencycontact_relation}
                    placeholder="Enter the relation"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col items-center gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
                name="admission_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Admission Date!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="admission_date"
                  >
                    Admission Date
                  </label>
                  <DatePicker
                    defaultValue={dayjs(formValue.admission_date)}
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("admission_date", date);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
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
                      defaultValue={formValue.department_id}
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
              <Form.Item<StudentFields>
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select the program type!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="type"
                  >
                    Program Type
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder={"Select Program Type"}
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("type", value);
                      }}
                      defaultValue={formValue.type}
                      options={[
                        {
                          value: "Undergraduate",
                          label: "Undergraduate",
                        },
                        {
                          value: "Masters",
                          label: "Masters Degree",
                        },
                        {
                          value: "PhD",
                          label: "PhD",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item>
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="profile_pic"
                  >
                    Profile Picture
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Upload>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
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
