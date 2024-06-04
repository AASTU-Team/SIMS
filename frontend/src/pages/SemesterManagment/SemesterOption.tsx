import {Switch, Popconfirm, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SemesterDetails } from "../../type/registration";

export default function SemesterOption({semester}:{semester: SemesterDetails}) {
  const navigate = useNavigate()
  // const batches = ["1", "2", "3", "4"];
  return (
    <div className="flex gap-5 divide-x divide-slate-200 justify-between mx-5">
      <div className="flex flex-col gap-5 bg-transparent pb-2">
        <span className="font-semibold text-lg underline">Actions</span>
        <div className="flex flex-col gap-5">
          <Button type="primary">Edit Semester</Button>
          <Button danger>Delete Semester</Button>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-transparent pb-2 px-4">
        <span className="font-semibold text-lg underline">Semester Status</span>
        <div className="flex flex-col justify-between gap-3">
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Semester Status</span>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Deactive"
                onChange={(checked) => {
                  console.log(checked);
                }}
              />
            </Popconfirm>
          </div>
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Registration Status</span>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Switch
                checkedChildren="Open"
                unCheckedChildren="Closed"
                onChange={(checked) => {
                  console.log(checked);
                }}
              />
            </Popconfirm>
          </div>
          <div className="flex gap-2 justify-between">
            <span className="font-semibold">Add/Drop Status</span>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Switch
                checkedChildren="Open"
                unCheckedChildren="Closed"
                onChange={(checked) => {
                  console.log(checked);
                }}
              />
            </Popconfirm>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 bg-transparent pb-2 px-4">
        <span className="font-semibold text-lg underline">Batches</span>
        <div className="grid grid-cols-3 gap-5">
          {semester?.batches?.map((batch) => (
            <div className="flex gap-3 items-center">
              <span className="font-semibold">Year {batch}:</span>
              <Button
                id={batch}
                onClick={() => {
                  navigate(`/semester/batches/`, { state: { semesterId: semester?.id, batch: batch, semester: semester?.semester}});
                }}
              >
                View Batch Detail
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
