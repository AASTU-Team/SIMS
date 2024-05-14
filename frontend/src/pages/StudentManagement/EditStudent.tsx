import type { FormProps } from "antd";
import { Button, Form, Input, Select, Upload, DatePicker } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { StudentFields } from "../../type/student";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function EditStudent() {
  const [form] = Form.useForm();
  const {state}: {state: StudentFields} = useLocation();
  console.log(state)
  useEffect(() => {
    if (state) {
      form.setFieldsValue(state);
    }
  }, [form, state]);
  
  const onFinish: FormProps<StudentFields>["onFinish"] = (values) => {
    console.log("Success:", values);
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
          className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90" 
          >
            <UserOutlined />
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
              <Form.Item<StudentFields>
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
              <Form.Item<StudentFields>
                name="id"
                rules={[{ required: true, message: "Please input the ID!" }]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="id"
                >
                  ID
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the ID"
                  defaultValue={state?.id}
                />
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
                name="contact"
                rules={[
                  {
                    required: true,
                    message: "Please input the phone number!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="contact"
                >
                  Phone Number
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the phone number"
                  defaultValue={state?.contact}
                />
              </Form.Item>
              <Form.Item<StudentFields>
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input the student's address!",
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
              <Form.Item>
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
              </Form.Item>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<StudentFields>
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
              <Form.Item<StudentFields>
                name="year"
                rules={[{ required: true, message: "Please input the Year!" }]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="year"
                >
                  Year
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the address"
                  type="number"
                  defaultValue={state?.year}
                />
              </Form.Item>

              <Form.Item<StudentFields>
                name="admission_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Admission Date!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="admission_date"
                >
                  Admission Date
                </label>
                <DatePicker className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
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
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="emergencycontact_name"
                >
                  Emergency Contact Full Name
                </label>

                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the full name"
                  defaultValue={state?.emergencycontact_name}
                />
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
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="emergencycontact_phone"
                >
                  Emergency Contact Phone Number
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the phone number"
                  defaultValue={state?.emergencycontact_phone}
                />
              </Form.Item>
              <Form.Item<StudentFields>
                name="emergencycontact_relation"
                rules={[
                  { required: true, message: "Please input the relation!" },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="emergencycontact_relation"
                >
                  Emergency Contact Relations
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the relation"
                  defaultValue={state?.emergencycontact_relation}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>


    </div>
  );
}