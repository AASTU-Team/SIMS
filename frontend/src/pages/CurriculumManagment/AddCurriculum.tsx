import type { FormProps } from "antd";
import { Form, Input, Select } from "antd";
import { CurriculumFields } from "../../type/curriculum";

export default function AddCurriculum() {
  const [form] = Form.useForm();
  
  const onFinish: FormProps<CurriculumFields>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<CurriculumFields>["onFinishFailed"] = (
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
            Add Curriculum
          </h3>

          <button
            onClick={() => form.submit()}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
            Add Curriculum
          </button>
        </div>
        <div className="p-7">
          <Form
            name="curriculum_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelWrap={true}
            form={form}
          >
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CurriculumFields>
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the curriculum name!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="name"
                  >
                    Curriculum Name
                  </label>
                  <Input
                    placeholder="Enter the curriculum name"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CurriculumFields>
                name="department_id"
                rules={[
                  {
                    required: true,
                    message: "Please select the department!",
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
              <Form.Item<CurriculumFields>
                name="credits_required"
                rules={[
                  {
                    required: true,
                    message: "Please input the required credits!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="credits_required"
                >
                  Credits Required
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the required credits"
                  type="number"
                />
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CurriculumFields>
                name="semester"
                rules={[
                  {
                    required: true,
                    message: "Please input the semester!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="semester"
                >
                  Semester
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the semester"
                />
              </Form.Item>
              <Form.Item<CurriculumFields>
                name="year"
                rules={[
                  {
                    required: true,
                    message: "Please input the year!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="year"
                >
                  Year
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the year"
                />
              </Form.Item>
              <Form.Item<CurriculumFields>
                name="courses"
                rules={[
                  {
                    required: true,
                    message: "Please input the courses!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="courses"
                >
                  Courses
                </label>

                <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                  <Select
                    mode="multiple"
                    placeholder="Select Courses"
                    options={[
                      {
                        value: "course1",
                        label: "Course 1",
                      },
                      {
                        value: "course2",
                        label: "Course 2",
                      },
                      {
                        value: "course3",
                        label: "Course 3",
                      },
                    ]}
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 ">
              <Form.Item<CurriculumFields>
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input the description!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="description"
                >
                  Description
                </label>
                <Input.TextArea
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the description"
                  rows={4}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
