import StudentTable from "./table";
import { UserAddOutlined } from "@ant-design/icons";
export default function StudentManagement() {
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Student Management</div>
        <button className="flex justify-center items-center gap-2 rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90">
          <UserAddOutlined />
          Add Student
        </button>
      </div>
      <StudentTable />
    </div>
  );
}
