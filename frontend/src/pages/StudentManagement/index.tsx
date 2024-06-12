import StudentTable from "./table";
import { useState } from "react";
import { UserAddOutlined, UploadOutlined, InboxOutlined,DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Upload, message, notification } from "antd";
import type { FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { downloadTemplate,exportStudent, sendStudentCsv } from "../../api/student";
import type { UploadProps } from "antd";
import {  DeleteOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";


export default function StudentManagement() {
  const { Dragger } = Upload;
  const [open, setOpen] = useState(false);
  const router = useNavigate()
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  

  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
     const isCSV = file.type === "text/csv";
     const isSizeValid = file.size / 1024 / 1024 < 10; // Check if file size is less than 10MB
     if (!isCSV) {
      message.error(`${file.name} is not a CSV file`);
     }
     if (!isSizeValid) {
      message.error(`${file.name} is larger than 10MB`);
     }
     return (isCSV && isSizeValid) || Upload.LIST_IGNORE;
    },
    customRequest: ({ file }) => {
     console.log(file);
     if (file) {
      const fileObj = file as File;
      setFile(fileObj); // Set the file to the file state
     }
    },
    showUploadList: false,
  };

  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex flex-col justify-between sm:flex-row sm:gap-2">
        <div className="text-title-md">Student Management</div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
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
          <button onClick={()=>exportStudent()} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90" >
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
            onClick={()=>{
              sendStudentCsv(file)
              notification.success({
                message: "Success",
                description: "Students registered successfully",
              })
              queryClient.invalidateQueries({queryKey:["students"]})
              setFile(null)
              setOpen(false)
            }}
            disabled={file===null}
            className="bg-primary hover:bg-primary hover:text-white hover:bg-opacity-90"
            style={{
              marginTop: 16,
            }}
          >
             Register
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
            {
              file?
              (<div className="flex gap-5 font-medium text-[15px]">
                Attached Document:
                <span className="text-blue-900"> {file?.name}</span>
                <DeleteOutlined
                  className="text-red"
                  onClick={() => setFile(null)}
                />
              </div>):
            (<Dragger {...props}>
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
            </Dragger>)

            }
          </Form.Item>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
