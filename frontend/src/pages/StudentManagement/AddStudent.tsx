import type { FormProps } from "antd";
import {UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, DatePicker, notification, message } from "antd";
import { StudentFields } from "../../type/student";
import { useMutation, useQuery } from "@tanstack/react-query";
import { registerStudent } from "../../api/student";
import { getDepartment } from "../../api/departmentApi";
import { DepartmentFields } from "../../type/department";
import type { UploadProps } from "antd";

export default function AddStudent() {
  const departmentQuery=useQuery({
    queryKey: ["department"],
    queryFn: getDepartment
  });
  const [form] = Form.useForm();
  const AddStudentMutation = useMutation({
    mutationKey: ["addStudent"],
    mutationFn: (values: StudentFields) => registerStudent(values),
    onError: () => {
      notification.error({ message: "Student Not Registered" });
    },
    onSuccess: () => {
      notification.success({ message: "Student Registered Successfully" });
      form.resetFields();
    },
  });
  const onFinish: FormProps<StudentFields>["onFinish"] = (values) => {
    console.log(values);
    values.phone = values.contact;
    values.grad_date = values.admission_date;
    values.status = "Inactive";
    AddStudentMutation.mutate(values);
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

  const props: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-lg text-black dark:text-white">
            Register Student
          </h3>

          <button
            onClick={() => form.submit()}
            disabled={AddStudentMutation.isPending}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            {AddStudentMutation.isPending ? (
              <div className="flex items-center justify-center bg-transparent">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
              </div>
            ) : (
              <UserAddOutlined />
            )}
            Register User
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
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("birthday", date);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item<StudentFields>
                name="contact"
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
                    htmlFor="contact"
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
                    placeholder="Enter the phone number"
                  />
                </div>
              </Form.Item>

              <Form.Item<StudentFields>
                name="emergencycontact_relation"
                rules={[
                  {
                    required: true,
                    message: "Please input the relation!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emergencycontact_relation"
                  >
                    Emergency Contact Relations
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select relation"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("emergencycontact_relation", value);
                      }}
                      options={[
                        {
                          value: "Parent",
                          label: "Parent",
                        },
                        {
                          value: "Guardian",
                          label: "Guardian",
                        },
                        {
                          value: "Sibling",
                          label: "Sibling",
                        },
                        {
                          value: "Other",
                          label: "Other",
                        },
                      ]}
                    />
                  </div>
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
            <div className="mb-5.5 flex flex-col items-center gap-5.5 sm:flex-row">
              <Form.Item>
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="profile_pic"
                  >
                    Profile Picture
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="flex justify-end items-center gap-3 ">
              <button
                onClick={() => form.resetFields()}
                disabled={AddStudentMutation.isPending}
                className="flex justify-center items-center gap-2 rounded-lg h-12 bg-slate-500 px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  form.submit();
                }}
                disabled={AddStudentMutation.isPending}
                className="flex justify-center items-center gap-2 rounded-lg h-12 bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
              >
                <UserAddOutlined />
                Register User
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
