import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import CourseTable from "./CourseTable";

type BatchCoursesProps = {
    semesterId: string;
    batch: string;
    semester: string;}

export default function BatchCourses() {
    const {state}: {state:BatchCoursesProps} = useLocation();
    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Courses",
            children: <CourseTable {...state} />
        },
        {
            key: "2",
            label: "Course Assignment History",
            children: <div>Course Assignment History</div>,
        },
    ];
  return (
    <div className="max-w-screen-2xl p-4 md:p-5 2xl:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Batch Details
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" to="/semester" id={state?.semesterId}>
                Semester {state?.semester} /
              </Link>
            </li>
            <li className="font-medium text-primary">Year {state?.batch}</li>
          </ol>
        </nav>
      </div>
      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
}
