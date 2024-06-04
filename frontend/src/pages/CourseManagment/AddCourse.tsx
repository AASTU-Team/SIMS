import type { FormProps } from "antd";
import {Form, Input, Select,notification } from "antd";
import { CourseFields, Assessments } from "../../type/course";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addCourse, getCourse } from "../../api/course";
import { getDepartment } from "../../api/departmentApi";
import { DepartmentFields } from "../../type/department";
import {DeleteOutlined} from "@ant-design/icons"
import { useState } from "react";

export default function AddCourse() {
  const [form] = Form.useForm();
  const [assessments, setAssessments] = useState<Assessments[]>([]);
  const departmentQuery = useQuery({
      queryKey: ["department"],
      queryFn: getDepartment,
    });
  const courseQuery = useQuery({
      queryKey: ["course"],
      queryFn: getCourse,
    });

  const AddCourseMuations = useMutation({
       mutationKey: ["addCourse"],
       mutationFn: (values: CourseFields) => addCourse(values),
       onError: () => {
         notification.error({ message: "Course Not Created" });
       },
       onSuccess: () => {
         notification.success({ message: "Course Created Successfully" });
         form.resetFields();
         courseQuery.refetch();
       },
     });
  
  const onFinish: FormProps<CourseFields>["onFinish"] = (values) => {
    console.log("Success:", values);
    AddCourseMuations.mutate(values);
  };

  const onFinishFailed: FormProps<CourseFields>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onAddAssessment = ()=>{
    const l = assessments.length.toString();
    const newAsses={id:l}
    setAssessments([... assessments, newAsses])
  }
   
  const onDeleteAssessment = (id:string) =>{
    setAssessments(assessments.filter((assessment)=>assessment.id !== id))
    setAssessmentValue()
  }

  const onAssessmentNameChange = (name:string,id:string) => {
    const newAssessments = assessments.map((assessment) => {
      if (assessment.id === id) {
        return { ...assessment, name };
      }
      return assessment;
    });
    setAssessments(newAssessments);
  }
  const onAssessmentValueChange = (value: number, id: string) => {
      const newAssessments = assessments.map((assessment) => {
        if (assessment.id === id) {
          return { ...assessment, value };
        }
        return assessment;
      });
      setAssessments(newAssessments);
      setAssessmentValue()
    };
  
  const setAssessmentValue = () => {
    const sum = assessments.reduce((total, assessment) => total + (assessment.value || 0), 0);
    form.setFieldValue("assessment", sum);
    console.log(form.getFieldValue("assessment"))
  }

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

          <button
            onClick={() => form.submit()}
            disabled={AddCourseMuations.isPending}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90"
          >
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
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input the course code!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="code"
                  >
                    Course Code
                  </label>
                  <Input
                    placeholder="Enter the course code"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                    required: false,
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
                      mode="multiple"
                      placeholder={
                        courseQuery.isLoading
                          ? "Fetching Courses"
                          : "Select Perquisites"
                      }
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("prerequisites", value);
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
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select course type"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("type", value);
                      }}
                      options={[
                        {
                          value: "major",
                          label: "Major Course",
                        },
                        {
                          value: "minor",
                          label: "Minor Course",
                        },
                        {
                          value: "elective",
                          label: "Elective Course",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CourseFields>
                name="option"
                rules={[
                  {
                    required: true,
                    message: "Please input the option!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="option"
                  >
                    Option
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select course option"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("option", value);
                      }}
                      options={[
                        {
                          value: "mandatory",
                          label: "Mandatory Course",
                        },
                        {
                          value: "elective",
                          label: "Elective Course",
                        },
                      ]}
                    />
                  </div>
                </div>
              </Form.Item>
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
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<CourseFields>
                name="tut"
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
                    htmlFor="tut"
                  >
                    Tutorial Hours
                  </label>
                  <Input
                    placeholder="Enter the tut hours"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
                name="hs"
                rules={[
                  {
                    required: true,
                    message: "Please input the HS hours!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="hs"
                  >
                    HS Hours
                  </label>
                  <Input
                    placeholder="Enter the hs hours"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
              <Form.Item<CourseFields>
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
                    placeholder="Enter the description"
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item
                name="assessment"
                rules={[
                  {
                    required: true,
                    message: "Please make sure the sum of all assessments is 100!",
                    validator: (_, value) => {
                      if (value === 100) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "The assessment value must be 100!"
                      );
                    },
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="description"
                >
                  Assessments
                </label>
                <div className="flex flex-col gap-3">
                  { assessments &&
                   assessments.map((assessment)=>{
                    return (
                      <div className="flex  gap-2 rounded-lg border border-stroke bg-transparent justify-center items-center p-3">
                        <div>
                          <Input
                            placeholder="Enter the assessment name"
                            className=" rounded-lg w-60 border border-stroke bg-transparent py-1 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            id={assessment.id}
                            value={assessment?.name || ""}
                            onChange={(event) => {
                              const inputId = event.currentTarget.id;
                              const inputValue = event.currentTarget.value;
                              onAssessmentNameChange(inputValue, inputId);
                            }}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Enter the assessment value"
                            type="number"
                            className=" rounded-lg w-60 border border-stroke bg-transparent py-1 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            id={assessment.id}
                            value={assessment?.value || ""}
                            onChange={(event) => {
                              const inputId = event.currentTarget.id;
                              const inputValue = Number(event.currentTarget.value); // Convert the inputValue to a number
                              onAssessmentValueChange(inputValue, inputId);
                            }}
                          />
                        </div>
                        <div
                          id={assessment.id}
                          key={assessment.id}
                          className="cursor-pointer"
                        >
                          <DeleteOutlined
                            id={assessment.id}
                            key={assessment.id}
                            name={assessment.id}
                            onClick={(event) => {
                              const iconId = event.currentTarget.id;
                              onDeleteAssessment(iconId);
                            }}
                            style={{ fontSize: "20px", color: "#cc0000" }}
                          />
                        </div>
                      </div>
                    );
                   })
                  }
                  <button
                    className="flex justify-center items-center gap-2 rounded-lg bg-primary px-2 py-1 font-medium text-md text-gray hover:bg-opacity-90"
                    onClick={(e)=>{
                      e.preventDefault()
                      onAddAssessment()
                    }}
                  >
                    Add Assessment
                  </button>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
