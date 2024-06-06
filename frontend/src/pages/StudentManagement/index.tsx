import StudentTable from "./table";
import { useState } from "react";
import { UserAddOutlined, UploadOutlined, InboxOutlined,DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Upload, message } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { downloadTemplate } from "../../api/student";
import type { UploadProps } from "antd";


export default function StudentManagement() {
  const { Dragger } = Upload;
  const [open, setOpen] = useState(false);
  const router = useNavigate()
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    setUploading(true);
    fetch("http://localhost:3000/user/register/studentCsv", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("upload successfully.");
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    // onRemove: (file) => {
    //   const index = fileList.indexOf(file);
    //   const newFileList = fileList.slice();
    //   newFileList.splice(index, 1);
    //   setFileList(newFileList);
    // },
    // beforeUpload: (file) => {
    //   setFileList([...fileList, file]);
    //   return false;
    // },
    // fileList,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
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
          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
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
          <Button key="download" onClick={() => downloadTemplate()}>
            Download Template
          </Button>,
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            className="bg-primary hover:bg-primary hover:text-white hover:bg-opacity-90"
            loading={uploading}
            style={{
              marginTop: 16,
            }}
          >
            {uploading ? "Uploading" : "Register"}
          </Button>,
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
        <Form
          name="multiple registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="user_list">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single csv file upload. Strictly follow the
                template provided.
              </p>
            </Dragger>
          </Form.Item>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
