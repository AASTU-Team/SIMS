import type { FormProps } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Select, Upload, Modal } from "antd";
const { Option } = Select;
import { UserFields } from "../../types/user";
import { useState } from "react";


export default function RegisterUser() {
    const [open, setOpen] = useState(false);

    const onFinish: FormProps<UserFields>["onFinish"] = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed: FormProps<UserFields>["onFinishFailed"] = (
      errorInfo
    ) => {
      console.log("Failed:", errorInfo);
    };
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Register User
              </h3>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                size="large"
                onClick={() => setOpen(true)}
              >
                Register Multiple Users
              </Button>
            </div>
            <div className="p-7">
              <Form
                name="registration_form"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                labelAlign="left"
              >
                <Form.Item<UserFields>
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input the full name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<UserFields>
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input the email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<UserFields>
                  label="ID"
                  name="id"
                  rules={[{ required: true, message: "Please input the ID!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<UserFields>
                  label="Role"
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one role!"
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="student"> Student </Radio>
                    <Radio value="staff"> Staff </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item<UserFields> name="tasks" label="Select Tasks">
                  <Select mode="multiple" placeholder="Please select tasks.">
                    <Option value="create_users">Create Users</Option>
                    <Option value="register_students">Register Students</Option>
                    <Option value="view_calendar">View Calendar</Option>
                  </Select>
                </Form.Item>

                <Form.Item<UserFields> label="Profile Picture">
                  <Form.Item
                    name="profile_pic"
                    valuePropName="fileList"
                    noStyle
                  >
                    <Upload.Dragger name="files" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag pictures to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a pictures only
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Register User
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
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
          <Button key="submit" type="primary" onClick={() => setOpen(false)}>
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
