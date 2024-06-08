// import { useQuery } from "@tanstack/react-query";
import { Table, Modal, Form, Select, Input, notification } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "../../api/course";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import SectionDropDown from "./SectionDropDown";
import { createSection } from "../../api/registration";
import { acceptAddDropDep } from "../../api/student";

const { confirm } = Modal;


export default function AddDropRequests() {
  const router = useNavigate();
   const queryClient= useQueryClient();
   const [form] = Form.useForm();
   const { state }:{state:{courseToAdd:CourseFields[],courseToDrop:CourseFields[], year:number,semester:number,type:string,addDrop_id:string}} = useLocation();
   console.log("State",state);
  const [assignment,setAssignment] = useState<{section_id:string,course_id:string}[]>([]);
  console.log(assignment)
  const [open,setOpen] = useState(false);
  const courseQuery = useQuery({
    queryKey: ["course"],
    queryFn: getCourse,
  });
  // console.log("Course Query",courseQuery);
  const CreateSection = useMutation({
     mutationKey: ["createNewSection"],
     mutationFn: ({ name,course_id }: { name: string; course_id: string }) =>
       createSection(course_id,name, state.year, state.semester,state.type),
     onError: () => {
       notification.error({ message: "Section Not Created" });
     },
     onSuccess: () => {
       notification.success({ message: "Section Creation Successfully" });
       queryClient.refetchQueries({ queryKey: ["batchCoursesSection"] });
       form.resetFields();
       setOpen(false);
     },
   });
     const ApproveRequestMuation = useMutation({
       mutationKey: ["approveAddDropRequestDep"],
       mutationFn: ()=>acceptAddDropDep(state.addDrop_id,assignment),
       onError: () => {
         notification.error({ message: "Request Approval Failed" });
       },
       onSuccess: () => {
         Modal.success({
           title: "Request Approval Successful",
           content: "Click the button below to go to back.",
           okText: "Go to Department Request",
           style: { margin: "0 auto" },
           onOk: () => {
             router("/studentDepReg");
           },
         });
       },
     });
     const showConfirm = () => {
       confirm({
         title: "Are you sure you want to approve this request?",
         icon: <ExclamationCircleFilled />,
         content:
           "Make sure all the details are correct.",
         okText:"Confirm",
         onOk() {
           ApproveRequestMuation.mutate();
         },
         onCancel() {
           console.log("Cancel");
         },
       });
     };

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
      render: (record: CourseFields) => (
        <SectionDropDown
          course_id={record._id || ""}
          batch={state.year}
          semester={state.semester}
          setAssignment={setAssignment}
          assignment={assignment}
        />
      ),
    },
  ];

  const onFinish =(values: { section_name: string; courses: string }) => {
    // console.log("Success:", values);
    CreateSection.mutate({
      name: values.section_name,
      course_id: values.courses,
    });
  }


//   {
//     name: "Internet Programming",
//     code: "CSE 101",
//     lec: "2",
//     lab: "1",
//     tut: "1",
//     hs: "1",
//     type: "Core",
//     option: "Elective",
//     credits: "3",
//   },
// ];
  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-title-md">Dropped Courses</div>
        </div>
        <Table
          columns={columns}
          dataSource={state.courseToDrop}
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
          dataSource={state.courseToAdd}
          scroll={{ x: 1300 }}
        />
        <div className="flex gap-2 justify-end">
          
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={showConfirm}
          >
            Approve Request
          </button>
          <button
            className="flex justify-center items-center gap-2 rounded-lg border border-red px-4 py-2 text-red hover:bg-red hover:bg-opacity-10"
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
            <button
              className="flex justify-center items-center gap-2 rounded-lg px-4 py-2 font-mediumhover:bg-opacity-90"
              key="back"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={() => form.submit()}
              className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Create Section
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
        <Form name="add section" form={form} onFinish={onFinish}>
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
                  onChange={(value) => {form.setFieldValue("courses",value)}}
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
