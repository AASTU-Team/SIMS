import {
  Switch,
  Button,
  notification,
  DatePicker,
  Input,
  Form,
  Modal,
  Select,
  Popconfirm
} from "antd";
import { useNavigate } from "react-router-dom";
import { SemesterDetails } from "../../type/registration";
import {
  activateAddDrop,
  activateRegistration,
  activateSemester,
  deactivateAddDrop,
  deactivateRegistration,
  deactivateSemester,
  deleteSemester,
  updateSemester,
} from "../../api/registration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import type { FormProps } from "antd";
import dayjs from "dayjs";
import { QuestionCircleOutlined } from "@ant-design/icons";


export default function SemesterOption({
  semester,
}: {
  semester: SemesterDetails;
}) {
  const navigate = useNavigate();
  const [form] = useForm();
  form.setFieldValue("batches", semester.batches);
  form.setFieldValue("program", semester.program);
  form.setFieldValue("semester", semester.semester);
  form.setFieldValue("academic_year", semester.academic_year);
  form.setFieldValue("start_date", semester.start_date);
  form.setFieldValue("end_date", semester.end_date);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationKey: ["updateSemester"],
    mutationFn: (values:SemesterDetails) => updateSemester(values,semester?._id || "") ,
    onError: () => {
      notification.error({ message: "Semester Update Failed" });
    },
    onSuccess: () => {
      notification.success({ message: "Semester Update Successfully" });
    },
  });

  const onFinish: FormProps["onFinish"] = (values) => {
    values.status = "Active";
    updateMutation.mutate(values)
    queryClient.refetchQueries({ queryKey: ['semester'] });
    setOpen(false);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const regActivateMutation = useMutation({
    mutationKey: ["regActivate"],
    mutationFn: (id: string) => activateRegistration(id),
    onError: () => {
      notification.error({ message: "Registration Activation Failed" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Activation Successfully" });
    },
  });
  const regDeactivateMutation = useMutation({
    mutationKey: ["regDeactivate"],
    mutationFn: (id: string) => deactivateRegistration(id),
    onError: () => {
      notification.error({ message: "Registration Deactivation Failed" });
    },
    onSuccess: () => {
      notification.success({
        message: "Registration Deactivation Successfully",
      });
    },
  });
  const semActivateMutation = useMutation({
    mutationKey: ["semActivate"],
    mutationFn: (id: string) => activateSemester(id),
    onError: () => {
      notification.error({ message: "Semester Activation Failed" });
    },
    onSuccess: () => {
      notification.success({
        message: "Semester Activation Successfully",
      });
    },
  });
  const semDeactivateMutation = useMutation({
    mutationKey: ["semDeactivate"],
    mutationFn: (id: string) => deactivateSemester(id),
    onError: () => {
      notification.error({ message: "Semester Deactivation Failed" });
    },
    onSuccess: () => {
      notification.success({
        message: "Semester Deactivation Successfully",
      });
    },
  });
  const addActivateMutation = useMutation({
    mutationKey: ["addActivate"],
    mutationFn: (id: string) => activateAddDrop(id),
    onError: () => {
      notification.error({ message: "Add/Drop Activation Failed" });
    },
    onSuccess: () => {
      notification.success({
        message: "Add/Drop Activation Successfully",
      });
    },
  });
  const addDeactivateMutation = useMutation({
    mutationKey: ["addDeactivate"],
    mutationFn: (id: string) => deactivateAddDrop(id),
    onError: () => {
      notification.error({ message: "Add/Drop Deactivation Failed" });
    },
    onSuccess: () => {
      notification.success({
        message: "Add/Drop Deactivation Successfully",
      });
    },
  });
  // const batches = ["1", "2", "3", "4"];
  return (
    <div className="flex gap-5 divide-x divide-slate-200 justify-between mx-5">
      <div className="flex flex-col gap-5 bg-transparent pb-2">
        <span className="font-semibold text-lg underline">Actions</span>
        <div className="flex flex-col gap-5">
          <Button type="primary" onClick={() => setOpen(true)}>
            Edit Semester
          </Button>
          <Popconfirm
            title="Delete the student"
            description="Are you sure to delete this student?"
            onConfirm={() => {
              deleteSemester(semester?._id || "");
              queryClient.refetchQueries({ queryKey: ["semester"] });
            }}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>Delete Semester</Button>
          </Popconfirm>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-transparent pb-2 px-4">
        <span className="font-semibold text-lg underline">Semester Status</span>
        <div className="flex flex-col justify-between gap-3">
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Semester Status</span>

            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked={semester.status === "Active"}
              onChange={() => {
                if (semester?.status === "Active") {
                  semDeactivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                } else {
                  semActivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                }
              }}
            />
          </div>
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Registration Status</span>

            <Switch
              checkedChildren="Open"
              unCheckedChildren="Closed"
              defaultChecked={semester.regStatus === "Active"}
              onChange={() => {
                if (semester?.regStatus === "Active") {
                  regDeactivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                } else {
                  regActivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                }
              }}
            />
          </div>
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Add/Drop Status</span>

            <Switch
              checkedChildren="Open"
              unCheckedChildren="Closed"
              defaultChecked={semester.addStatus === "Active"}
              onChange={() => {
                if (semester?.addStatus === "Active") {
                  addDeactivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                } else {
                  addActivateMutation.mutate(semester?._id || "");
                  queryClient.refetchQueries({ queryKey: ["semester"] });
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-transparent pb-2 px-4">
        <span className="font-semibold text-lg underline">Batches</span>
        <div className="grid grid-cols-3 gap-5">
          {semester?.batches?.map((batch) => (
            <div className="flex gap-3 items-center">
              <span className="font-semibold">Year {batch}:</span>
              <Button
                id={batch}
                onClick={() => {
                  navigate(`/semester/batches/`, {
                    state: {
                      semesterId: semester?.id,
                      batch: batch,
                      semester: semester?.semester,
                      type: semester?.program,
                    },
                  });
                }}
              >
                View Batch Detail
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Modal
        centered
        open={open}
        width={900}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Edit Semester"
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
            Edit
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
                      defaultValue={semester.batches}
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
                      defaultValue={semester.program}
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
                      defaultValue={semester.semester}
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
                    defaultValue={semester.academic_year}
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
                    defaultValue={dayjs(semester.start_date)}
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
                    defaultValue={dayjs(semester.end_date)}
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
