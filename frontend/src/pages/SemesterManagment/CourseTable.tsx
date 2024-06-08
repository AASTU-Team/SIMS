import { Button, Input, Modal, notification, Table, Form } from "antd";
import type { TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import SectionDetails from "./SectionDetail";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBatchCourses } from "../../api/registration";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";
import { allocateSection } from "../../api/student";
import { useState } from "react";

type BatchCoursesProps = {
  semesterId: string;
  batch: string;
  semester: string;
  type:string;
};



export default function CourseTable(state:BatchCoursesProps) {
  const user = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);
  console.log(state)
  const [form] = Form.useForm();

  const allocateSectionMutation = useMutation({
    mutationKey: ["allocateSection"],
    mutationFn: (max: number) =>
      allocateSection(
        user.department,
        parseInt(state.batch),
        parseInt(state.semester),
        max,
        state.type
      ),
    onError: () => {
      notification.error({ message: "Section Not Allocated" });
    },
    onSuccess: () => {
      notification.success({ message: "Section Allocated" });
      query.refetch();
      form.resetFields();
      setOpen(false);
    },
  });
  const onFinish = (values: { section: string }) => {
    // console.log("values",values);
    allocateSectionMutation.mutate(parseInt(values.section));
  }; 

  const query = useQuery({
    queryKey: ["batchCourses"],
    queryFn: () =>
      getBatchCourses(
        user._id,
        parseInt(state.batch),
        parseInt(state.semester),
        state.type
      ),
  });
  // console.log(query)
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
  ];
  return (
    <div className="pt-1 flex flex-col gap-5">
      <Button onClick={()=>setOpen(true)} className="w-fit">Allocate Section</Button>
      {query.isPending ? (
        <div className="h-auto">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : (
        <Table
          columns={columns}
          rowKey={(record) => record._id || ""}
          dataSource={query?.data?.data?.data || []}
          scroll={{ x: 1300 }}
          expandable={{
            expandedRowRender: (record: CourseFields) => (
              <div className="p-2 bg-white">
                <SectionDetails semester={state} course={record} />
              </div>
            ),
          }}
        />
      )}
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Allocate Section"
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
            ALlocate
          </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form
          name="allocate section"
          onFinish={onFinish}
          form={form}
        >
          <div className="w-full">
            <div className="">
              <Form.Item
                name="section"
                rules={[
                  {
                    required: true,
                    message: "Please input the section allocation!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="section"
                  >
                    Maximum number of Students per Section
                  </label>
                  <Input
                    placeholder="Enter the maximum number of students per section"
                    id="section"
                    type="number"
                    className=" rounded-lg w-full border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
