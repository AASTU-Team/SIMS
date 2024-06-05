// import { useQuery } from "@tanstack/react-query";
import { Table, Modal, Form, Select, Input } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "../../api/course";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const showConfirm = () => {
  confirm({
    title: "Are you sure you want to register?",
    icon: <ExclamationCircleFilled />,
    content:
      "Make sure all the details are correct. Any problems can be addressed at the registrar office.",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export default function RegistrarAddDropRequests() {
  //   const query = useQuery({
  //     queryKey: ["myCourse"],
  //     queryFn: ?,
  //   });
  
  const [open,setOpen] = useState(false);
  const courseQuery = useQuery({
    queryKey: ["course"],
    queryFn: getCourse,
  });
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const columns: TableColumnsType<CourseFields> = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Lecture Hour",
      dataIndex: "lec",
      key: "lec",
      width: 70,
    },
    {
      title: "Lab. Hour",
      dataIndex: "lab",
      key: "lab",
      width: 70,
    },
    {
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 70,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 70,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 70,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 70,
    }
  ];

  const addDrop: TableColumnsType<CourseFields> = [
    {
      title: "Course Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Course Code",
      dataIndex: "code",
      key: "code",
      width: 70,
    },
    {
      title: "Lecture Hour",
      dataIndex: "lec",
      key: "lec",
      width: 70,
    },
    {
      title: "Lab. Hour",
      dataIndex: "lab",
      key: "lab",
      width: 70,
    },
    {
      title: "Tutor Hour",
      dataIndex: "tut",
      key: "tut",
      width: 70,
    },
    {
      title: "HS Hour",
      dataIndex: "hs",
      key: "hs",
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      width: 70,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      width: 70,
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 70,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: () => (
        <div className=" font-semibold w-auto">
          <Select
            showSearch
            placeholder="Select section"
            optionFilterProp="children"
            className="w-50"
            options={[
              {
                value: "a",
                label: "Section A - 30 Students",
              },
              {
                value: "b",
                label: "Section B - 20 Students",
              },
            ]}
          />
        </div>
      ),
    },
  ];
const data = [
  {
    name: "Internet Programming",
    code: "CSE 101",
    lec: "2",
    lab: "1",
    tut: "1",
    hs: "1",
    type: "Core",
    option: "Elective",
    credits: "3",
  },
];
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Dropped Courses</div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1300 }}
          pagination={false}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Added Courses</div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="flex justify-center w-30 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Add Section
            </button>
          </div>
        </div>
        <Table
          columns={addDrop}
          pagination={false}
          dataSource={data}
          scroll={{ x: 1300 }}
        />
        <div className="flex gap-2 justify-end pt-5">
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={showConfirm}
          >
            Approve Request
          </button>
          <button
            className="flex justify-center items-center gap-2 rounded-lg border border-red px-4 py-2 text-red "
            onClick={showConfirm}
          >
            Reject Request
          </button>
        </div>
      </div>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Create New Section"
        footer={[
          <div className="flex gap-2 justify-end">
            <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
              Add Courses
            </button>
            <button
              className="flex justify-center items-center gap-2 rounded-lg px-4 py-2 font-mediumhover:bg-opacity-90"
              key="back"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>,
          // <Button
          //   key="submit"
          //   type="primary"
          //   onClick={() => setOpen(false)}
          //   className="bg-primary hover:bg-primary bg-opacity-90"
          // >
          //   Register
          // </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm b</Form.Item>order border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form name="add section">
          <Form.Item
            name="section_name"
            rules={[
              {
                required: false,
                message: "Please input the section name!",
              },
            ]}
          >
            <div>
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="section_name"
              >
                Section Name
              </label>
              <Input
                className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter the Section Name"
              />
            </div>
          </Form.Item>
          <Form.Item
            name="courses"
            rules={[
              {
                required: false,
                message: "Please select the course!",
              },
            ]}
          >
            <div>
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="course"
              >
                Select Course
              </label>
              <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                <Select
                  showSearch
                  placeholder={
                    courseQuery.isLoading
                      ? "Fetching Courses"
                      : "Select Courses to Add"
                  }
                  optionFilterProp="children"
                  filterOption={filterOption}
                  onChange={(value) => console.log(value)}
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
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
