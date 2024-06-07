import type { FormProps } from "antd";
import { Form, Input, Select, notification } from "antd";
import { CurriculumFields } from "../../type/curriculum";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addCurriculum } from "../../api/curriculum";
import { getDepartment } from "../../api/departmentApi";
import { getCourse } from "../../api/course";
import { CourseFields } from "../../type/course";
import { DepartmentFields } from "../../type/department";

export default function AddCurriculum() {
  const [form] = Form.useForm();
  const departmentQuery = useQuery({
    queryKey: ["department"],
    queryFn: getDepartment,
  });
  const courseQuery = useQuery({
    queryKey: ["course"],
    queryFn: getCourse,
  });


  const AddCurriculumMutaiton = useMutation({
       mutationKey: ["addCurriculum"],
       mutationFn: (values: CurriculumFields) => addCurriculum(values),
       onError: () => {
         notification.error({ message: "Curriculum Not Created" });
       },
       onSuccess: () => {
         notification.success({ message: "Curriculum Created Successfully" });
         form.resetFields();
       },
     });
  
  const onFinish: FormProps<CurriculumFields>["onFinish"] = (values) => {
    AddCurriculumMutaiton.mutate(values);
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
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-lg text-black dark:text-white">
            Add Curriculum
          </h3>

          <button
            onClick={() => form.submit()}
            disabled={AddCurriculumMutaiton.isPending}
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
              <Form.Item<CurriculumFields>
                name="credits_required"
                rules={[
                  {
                    required: true,
                    message: "Please input the required credits!",
                  },
                ]}
              >
                <div>
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
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CurriculumFields>
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
              <Form.Item<CurriculumFields>
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
              <Form.Item<CurriculumFields>
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
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CurriculumFields>
                name="courses"
                rules={[
                  {
                    required: false,
                    message: "Please input the courses!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="courses"
                  >
                    Courses
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      mode="multiple"
                      placeholder={
                        courseQuery.isLoading
                          ? "Fetching Courses"
                          : "Select Courses"
                      }
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("courses", value);
                      }}
                      disabled={courseQuery.isLoading}
                      options={
                        courseQuery.isFetched
                          ? courseQuery.data?.data?.data?.map(
                              (value: CourseFields) => {
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
              <Form.Item<CurriculumFields>
                name="description"
                rules={[
                  {
                    required: false,
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
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the description"
                    rows={4}
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
