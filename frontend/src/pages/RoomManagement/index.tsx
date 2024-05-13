import RoomTable from "./table";
import { FileAddOutlined } from "@ant-design/icons";
export default function RoomManagement() {
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Room Management</div>
        <button className="flex justify-center items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90">
          <FileAddOutlined />
          Create Room
        </button>
      </div>
      <RoomTable />
    </div>
  );
}
