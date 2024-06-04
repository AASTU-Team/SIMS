import RoomTable from "./table";
import { useState } from "react";
import { UserAddOutlined, UploadOutlined, InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Upload } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";


export default function RoomManagement() {
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
        <div className="text-title-md">Room Management</div>
        <div className="flex gap-2">
          <button
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
            onClick={() => router("/room/add")}
          >
            <UserAddOutlined />
            Add Room
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <UploadOutlined />
            Add Multiple Rooms
          </button>
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
            <DownloadOutlined />
            Export List
          </button>
        </div>
      </div>
      <RoomTable />
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title="Add Multiple Rooms"
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
            Add
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
