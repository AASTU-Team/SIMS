import StudentTable from "./table";
import { useState } from "react";
import { UserAddOutlined, UploadOutlined, InboxOutlined,DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Upload } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { exportStaff } from "../../api/staff";


export default function StaffManagement() {
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
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Staff Management</div>
        <div className="flex gap-2">
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={() => router("/staff/add")}
          >
            <UserAddOutlined />
            Register Staff
          </button>
          {/* <button
            onClick={() => setOpen(true)}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <UploadOutlined />
            Register Multiple Staff Members
          </button> */}
          <button
            onClick={()=>exportStaff()}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <DownloadOutlined />
            Export List
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
          <Button
            key="submit"
            type="primary"
            onClick={() => setOpen(false)}
            className="bg-primary"
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
              <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag csv files to this area to upload
                </p>
                <p className="ant-upload-hint">Support for a csv files only</p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
