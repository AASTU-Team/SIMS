import StudentTable from "./table";
import { useState } from "react";
import { UserAddOutlined, UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Upload } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { downloadTemplate } from "../../api/student";


export default function StudentManagement() {
  const { Dragger } = Upload;
  const [open, setOpen] = useState(false);
  const router = useNavigate()
  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Student Management</div>
        <div className="flex gap-2">
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={() => router("/students/add")}
          >
            <UserAddOutlined />
            Register Student
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <UploadOutlined />
            Register Multiple Students
          </button>
        </div>
      </div>
      <StudentTable />
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Register Multiple Users"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="download" onClick={() => downloadTemplate()}>
            Download Template
          </Button>,
          // <Button
          //   type="primary"
          //   onClick={handleUpload}
          //   disabled={fileList.length === 0}
          //   className="bg-primary hover:bg-primary bg-opacity-90"
          //   loading={uploading}
          //   style={{
          //     marginTop: 16,
          //   }}
          // >
          //   {uploading ? "Uploading" : "Register"}
          // </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setOpen(false)}
            className="bg-primary hover:bg-primary bg-opacity-90"
          >
            Register
          </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form
          name="multiple registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item>
            <Form.Item name="user_list" valuePropName="fileList" noStyle>
              <Dragger>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            </Form.Item>
          </Form.Item>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
