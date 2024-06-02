// import { useQuery } from "@tanstack/react-query";
import { Table, Popconfirm, Modal,Form,Select } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { QuestionCircleOutlined } from "@ant-design/icons";
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

export default function AddDrop() {
  //   const query = useQuery({
  //     queryKey: ["myCourse"],
  //     queryFn: ?,
  //   });
  const [open,setOpen] = useState(false)
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
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (text, record) => (
        <div className="flex gap-2 px-4 font-semibold">
    
          <Popconfirm
            title="Delete the student"
            description="Are you sure to delete this student?"
            onConfirm={() => console.log(text, record)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <a className=" hover:text-red">Drop</a>
          </Popconfirm>
        </div>
      ),
    },
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
       width: 70,
       render: (text, record) => (
         <div className="flex gap-2 px-4 font-semibold">
           <Popconfirm
             title="Delete the student"
             description="Are you sure to delete this student?"
             onConfirm={() => console.log(text, record)}
             okText="Yes"
             cancelText="No"
             icon={<QuestionCircleOutlined style={{ color: "red" }} />}
           >
             <a className=" hover:text-red">Remove</a>
           </Popconfirm>
         </div>
       ),
     },
   ];

  return (
    <div className="pt-1 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Enrolled Courses</div>
          <div className="flex gap-2">
            <button
              onClick={() => setOpen(true)}
              className="flex justify-center w-30 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Add Course
            </button>
          </div>
        </div>
        <Table columns={columns} dataSource={[]} scroll={{ x: 1300 }} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Add/Drop Request</div>
          <div className="flex gap-2">
            <button
              onClick={showConfirm}
              className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Submit Request
            </button>
          </div>
        </div>
        <Table columns={addDrop} dataSource={[]} scroll={{ x: 1300 }} />
      </div>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Add Courses for this Semester"
        footer={[
          <button key="back" onClick={() => setOpen(false)}>
            Cancel
          </button>,
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
            Add Courses
          </button>,
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
        <Form name="add course">
          <Form.Item
            name="courses"
            rules={[
              {
                required: false,
                message: "Please input the course you want to add!",
              },
            ]}
          >
            <div>
              <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                <Select
                  showSearch
                  mode="multiple"
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
