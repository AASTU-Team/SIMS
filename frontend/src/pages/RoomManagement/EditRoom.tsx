import type { FormProps } from "antd";
import {Form, Input, Select} from "antd";
import { RoomFields } from "../../type/room";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function EditRoom() {
  const [form] = Form.useForm();
  const {state}: {state: RoomFields} = useLocation();
  console.log(state)
  useEffect(() => {
    if (state) {
      form.setFieldsValue(state);
    }
  }, [form, state]);
  
  const onFinish: FormProps<RoomFields>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<RoomFields>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-lg text-black dark:text-white">
            Edit Room
          </h3>

          <button className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-lg text-gray hover:bg-opacity-90">
            Edit Room
          </button>
        </div>
        <div className="p-7">
          <Form
            name="registration_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            labelWrap={true}
            form={form}
          >
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <Form.Item<RoomFields>
                name="room_number"
                rules={[
                  {
                    required: true,
                    message: "Please input the room number!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="number"
                >
                  Room Number
                </label>
                <Input
                  placeholder="Enter the room number"
                  defaultValue={state?.room_number}
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
              <Form.Item<RoomFields>
                name="block"
                rules={[
                  {
                    required: true,
                    message: "Please input the block!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="block"
                >
                  Block
                </label>
                <Input
                  className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter the block"
                  defaultValue={state?.block}
                />
              </Form.Item>
              <Form.Item<RoomFields>
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input the type!",
                  },
                ]}
              >
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="type"
                >
                  Type
                </label>
                <div className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                  <Select
                    placeholder="Select Type"
                    defaultValue={state?.type}
                    options={[
                      {
                        value: "lecture",
                        label: "Lecture Hall",
                      },
                      {
                        value: "class",
                        label: "Class Room",
                      },
                      {
                        value: "lab",
                        label: "Laboratory",
                      },
                      {
                        value: "office",
                        label: "Office",
                      },
                    ]}
                  />
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
