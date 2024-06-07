import SemesterTable from "./table";
import { useState } from "react";
import {  FileAddOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Select, DatePicker, Input, notification } from "antd";
import type { FormProps } from "antd";
import { SemesterDetails } from "../../type/registration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSemester } from "../../api/registration";


export default function SemesterManagement() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  
  const semesterMutation = useMutation({
    mutationKey: ["addSemester"],
    mutationFn: (values: SemesterDetails) => addSemester(values),
    onError: () => {
      notification.error({ message: "Semester Not Created" });
    },
    onSuccess: () => {
      notification.success({ message: "Semester Created Successfully" });
      queryClient.refetchQueries({ queryKey: ["semester"] });
      form.resetFields();
    },
  });
  
  const onFinish: FormProps["onFinish"] = (values) => {
    // console.log("Success:", values);
    semesterMutation.mutate(values);
    values.status="Active"
    
    // queryClient.invalidateQueries({ queryKey: ['semester'] });
    setOpen(false);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (
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
      <div className="flex justify-between">
        <div className="text-title-md">Semester Management</div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <FileAddOutlined />
            Add Semester
          </button>
        </div>
      </div>
      <SemesterTable />
      <Modal
        centered
        open={open}
        width={900}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Add Semester"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            className="bg-primary"
          >
            Create
          </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form
          name="semester registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <div className="flex gap-6 justify-center items-start">
            <div className="">
              <Form.Item<SemesterDetails>
                name="batches"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one batch!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="batches"
                  >
                    Batches
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select batches"
                      mode="multiple"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("batches", value);
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
              <Form.Item<SemesterDetails>
                name="program"
                rules={[
                  {
                    required: true,
                    message: "Please select the program!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="role"
                  >
                    Program Type
                  </label>
                  <div className=" rounded-lg w-100 border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <Select
                      showSearch
                      placeholder="Select program type"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        form.setFieldValue("program", value);
                      }}
                      options={[
                        {
                          value: "Undergraduate",
                          label: "Bachelors Degree",
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
              <Form.Item<SemesterDetails>
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
            <div className="">
              <Form.Item<SemesterDetails>
                name="academic_year"
                rules={[
                  {
                    required: true,
                    message: "Please input the Academic Year!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="academic_year"
                  >
                    Academic Year
                  </label>
                  <Input
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter the academic year"
                    type="number"
                  />
                </div>
              </Form.Item>
              <Form.Item<SemesterDetails>
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Start Date of the Semester!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="start_date"
                  >
                    Semester Start Date
                  </label>
                  <DatePicker
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("start_date", date);
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item<SemesterDetails>
                name="end_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the End Date of the Semester!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="end_date"
                  >
                    Semester End Date
                  </label>
                  <DatePicker
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("end_date", date);
                    }}
                  />
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
