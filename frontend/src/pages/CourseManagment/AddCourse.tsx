import type { FormProps } from "antd";
import {Form, Input, Select,notification } from "antd";
import { CourseFields } from "../../type/course";
import { useMutation } from "@tanstack/react-query";
import { addCourse } from "../../api/course";

export default function AddCourse() {
  const [form] = Form.useForm();

  const AddCourseMuations = useMutation({
       mutationKey: ["addCourse"],
       mutationFn: (values: CourseFields) => addCourse(values),
       onError: () => {
         notification.error({ message: "Department Not Created" });
       },
       onSuccess: () => {
         notification.success({ message: "Department Created Successfully" });
         form.resetFields();
       },
     });
  
  const onFinish: FormProps<CourseFields>["onFinish"] = (values) => {
    AddCourseMuations.mutate(values);
  };

  const onFinishFailed: FormProps<CourseFields>["onFinishFailed"] = (
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
            Add Course
          </h3>

          <button onClick={()=>form.submit} disabled={AddCourseMuations.isPending} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90">
            Add Course
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
              <Form.Item<CourseFields>
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the course name!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="name"
                  >
                    Course Name
                  </label>
                  <Input
                    placeholder="Enter the course name"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
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
                      placeholder="Select Department"
                      optionFilterProp="children"
                      filterOption={filterOption}
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
                </div>
              </Form.Item>

              <Form.Item<CourseFields>
                name="credits"
                rules={[
                  {
                    required: true,
                    message: "Please input the credits!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="credits"
                  >
                    Credits
                  </label>
                  <Input
                    placeholder="Enter the credits"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CourseFields>
                name="prerequisites"
                rules={[
                  {
                    required: true,
                    message: "Please input the prerequisites!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="prerequisites"
                  >
                    Prerequisites
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select course prerequisites"
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={[
                        {
                          value: "SWEG101",
                          label: "Internet Programming",
                        },
                        {
                          value: "SWEG102",
                          label: "Software Engineering",
                        },
                        {
                          value: "SWEG103",
                          label: "Software Project Management",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input the type!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="type"
                  >
                    Type
                  </label>
                  <Input
                    placeholder="Enter the type"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input the code!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="code"
                  >
                    Code
                  </label>
                  <Input
                    placeholder="Enter the code"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CourseFields>
                name="lec"
                rules={[
                  {
                    required: true,
                    message: "Please input the lecture hours!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="lec"
                  >
                    Lecture Hours
                  </label>
                  <Input
                    placeholder="Enter the lecture hours"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
                name="lab"
                rules={[
                  {
                    required: true,
                    message: "Please input the lab hours!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="lab"
                  >
                    Lab Hours
                  </label>
                  <Input
                    placeholder="Enter the lab hours"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
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
