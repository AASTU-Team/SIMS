import AttendanceTable from "./table";
import { useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import { Button, Modal, Form, DatePicker, Select } from "antd";
import type { FormProps } from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getCoursesInstructor, getSectionStudent } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { CourseFields } from "../../type/course";

export default function AttendanceManagement() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [records, setRecords] = useState<TableColumnsType>([]);
  const user = useSelector((state: RootState) => state.user);
  const [selectedCourse, setSelectedCourse] = useState<string>(""); 

  const query = useQuery({
    queryKey: ["courseForInstructor"],
    queryFn: () => getCoursesInstructor(user._id),
  });
  // console.log(query);

  const studentQuery = useQuery({
      queryKey: ["studentForInstructor"],
      queryFn: () => getSectionStudent(user._id,selectedCourse),
      enabled:false
    });
  console.log("Student Query",studentQuery);

  const columns = [
    {
      title: "Student Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Student ID",
      width: 150,
      dataIndex: "id",
      key: "id",
      fixed: "left",
      sorter: true,
    },
  ];

  const onFinish: FormProps["onFinish"] = (values) => {
    const formattedDate = new Date(values.record_date)
      .toISOString()
      .split("T")[0];

    const col: TableColumnsType = [
      {
        title: (
          <div>
            {formattedDate}
            <DeleteOutlined style={{ marginLeft: "10px" }} />
          </div>
        ),
        width: 150,
        dataIndex: formattedDate,
        key: formattedDate,
        fixed: undefined, // Set fixed property to undefined
      },
    ];
    setRecords([...records, ...col]);
    form.resetFields();
    setOpen(false);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const data: CourseFields[] = [];
  if (query.isSuccess && query.data?.data) {
    const uniqueData: CourseFields[] = [];
    const existingIds: string[] = [];

    for (let i = 0; i < query.data.data.length; i++) {
      const courseId = query.data?.data[i]?.course_id?._id;
      if (courseId && !existingIds.includes(courseId)) {
        existingIds.push(courseId);
        uniqueData.push({
          _id: courseId,
          name: query.data?.data[i]?.course_id?.name,
        });
      }
    }

    data.push(...uniqueData);
    const newSelectedCourse = data[0]?._id || "";
      if (selectedCourse !== newSelectedCourse) {
        setSelectedCourse(newSelectedCourse);
        studentQuery.refetch()
      }
  }

  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Attendance Management</div>
        <div className="flex gap-4 items-start justify-start">
          <Select
            showSearch
            className=" h-10 w-80"
            placeholder={query.isLoading ? "Fetching Courses" : "Select Course"}
            optionFilterProp="children"
            onChange={(value) => {
              setSelectedCourse( value);
              studentQuery.refetch()
            }}
            value={selectedCourse}
            options={
              query.isFetched
                ? data?.map((value: CourseFields) => {
                    return {
                      value: value._id,
                      label: value.name,
                    };
                  })
                : []
            }
          />
          <Select
            showSearch
            placeholder="Select Section"
            optionFilterProp="children"
            className=" h-10 w-50"
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
          <Select
            showSearch
            placeholder="Select Admission Type"
            optionFilterProp="children"
            mode="multiple"
            className=" h-10 w-50"
            options={[
              {
                value: "Regular",
                label: "Regular",
              },
              {
                value: "Add",
                label: "Add",
              },
            ]}
          />

          <button
            onClick={() => setOpen(true)}
            className="flex justify-center items-center h-fit gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <FileAddOutlined />
            Add Record
          </button>
        </div>
      </div>
      <AttendanceTable
        columns={[
          ...columns.map((column) => ({ ...column, fixed: undefined })),
          ...records,
        ]}
      />
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Add Record"
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
              <Form.Item
                name="record_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Date of the Record!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="record_date"
                  >
                    Record Date
                  </label>
                  <DatePicker
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("record_date", date);
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
