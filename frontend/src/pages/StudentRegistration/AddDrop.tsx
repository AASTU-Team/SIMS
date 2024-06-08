// import { useQuery } from "@tanstack/react-query";
import { Table, Popconfirm, Modal, Form, Select, notification } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  getAddableCourse,
  getEnrolledCourse,
  sendAddDropRequest,
} from "../../api/student";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";

const { confirm } = Modal;

export default function AddDrop() {
  const user = useSelector((state: RootState) => state.user);
  const query = useQuery({
    queryKey: ["myEnrolledCourse"],
    queryFn: () => getEnrolledCourse(user._id),
  });
  const [form] = Form.useForm();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseFields[]>([]);
  const [addDropCourses, setAddDropCourses] = useState<CourseFields[]>([]);
  const addDropMutation = useMutation({
    mutationKey: ["addDropCourses"],
    mutationFn: () => {
      const add = addDropCourses
        ?.filter((course) => course.class === "Add")
        ?.map((course) => course._id)
        .filter((course) => course !== undefined);
      const drop = addDropCourses
        ?.filter((course) => course.class === "Drop")
        ?.map((course) => course._id)
        .filter((course) => course !== undefined);
      return sendAddDropRequest(user._id, add, drop);
    },
    onError: () => {
      notification.error({ message: "Registration Unsuccessful" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Successfully" });
    },
  });
  useEffect(() => {
    if (query.isSuccess) {
      setEnrolledCourses(query?.data?.data?.message || []);
      setAddDropCourses([]);
    }
  }, [query.isSuccess, query.data]);
  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to send this request?",
      icon: <ExclamationCircleFilled />,
      content:
        "Make sure all the details are correct. Any problems can be addressed at the registrar office.",
      onOk() {
        addDropMutation.mutate();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [open, setOpen] = useState(false);
  const courseQuery = useQuery({
    queryKey: ["addableCourse"],
    queryFn: () => getAddableCourse(user._id),
  });
  // console.log("addable course", courseQuery);
  const dropCourse = (id: string) => {
    const droppedCourse = enrolledCourses.filter((course) => course._id === id);
    droppedCourse[0].class = "Drop";
    setEnrolledCourses(enrolledCourses.filter((course) => course._id !== id));
    setAddDropCourses([...addDropCourses, ...droppedCourse]);
  };

  const removeCourse = (id: string) => {
    const droppedCourse = addDropCourses.filter((course) => course._id === id);
    droppedCourse[0].class = "Drop";
    setAddDropCourses(addDropCourses.filter((course) => course._id !== id));
    setEnrolledCourses([...enrolledCourses, ...droppedCourse]);
  };

  const addCourse = (id: string[]) => {
    const courses = courseQuery.data?.data?.filter(
      (course: CourseFields) => id.includes(course._id||"")
    );
    courses.map((course:CourseFields) => (course.class = "Add"));
    // console.log(courses);
    setAddDropCourses([...addDropCourses, ...courses]);
    form.resetFields();
    setOpen(false);
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
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (text, record) => (
        <div className="flex gap-2 px-4 font-semibold">
          <Popconfirm
            title="Drop the course"
            description="Are you sure to drop this course?"
            onConfirm={() => dropCourse(record._id || "")}
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
      title: "Type",
      dataIndex: "class",
      key: "class",
      width: 100,
      render: (text, record) => (
        <div className="">
          {record.class == "Add" ? (
            <div className="text-green-500">Add</div>
          ) : (
            <div className="text-red">Drop</div>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 70,
      render: (text, record) => (
        <div className="flex gap-2 px-4 font-semibold">
          <Popconfirm
            title="Remove the course"
            description="Are you sure to remove this course?"
            onConfirm={() => removeCourse(record._id || "")}
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
  if (query.isPending) {
    return (
      <div className="h-auto">
        <Loader />
      </div>
    );
  }
  if (query.isError) {
    return <div>{`${query.error}`}</div>;
  }

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
        <Table
          columns={columns}
          dataSource={enrolledCourses} // Fix: Access the 'data' property of the resolved data
          scroll={{ x: 1300 }}
        />
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
        <Table
          columns={addDrop}
          dataSource={addDropCourses}
          scroll={{ x: 1300 }}
        />
      </div>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Add Courses for this Semester"
        footer={[
          <div className="flex gap-4 justify-end">
            <button key="back" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              onClick={() => addCourse(form.getFieldValue("courses"))}
              className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Add Courses
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
        <Form name="add course" form={form}>
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
                  onChange={(value) => form.setFieldValue("courses", value)}
                  disabled={courseQuery.isLoading}
                  options={
                    courseQuery.isFetched
                      ? courseQuery.data?.data?.map((value: CourseFields) => {
                          return {
                            value: value._id,
                            label: value.name,
                          };
                        })
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
