import { notification, Select, Table, TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { SectionFields } from "../../type/registration";
import { useMutation, useQuery } from "@tanstack/react-query";
import { assignInstructor, getCourseSections } from "../../api/registration";
import Loader from "../../components/Loader";
import { getStaffDep } from "../../api/staff";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { StaffFields } from "../../type/staff";

type BatchCoursesProps = {
  semesterId: string;
  batch: string;
  semester: string;
};

export default function SectionDetails({
  semester,
  course,
}: {
  semester: BatchCoursesProps;
  course: CourseFields;
}) {
  // console.log(semester, course);
  const user = useSelector((state: RootState) => state.user);

  const query = useQuery({
    queryKey: ["batchCoursesSection"],
    queryFn: () =>getCourseSections(course._id || "",parseInt(semester.batch),parseInt(semester.semester)),
  });
  console.log(query);
  const staffQuery = useQuery({
    queryKey: ["staffDepartment"],
    queryFn: ()=>getStaffDep(user.department),
  });
  // console.log("Staff Query",staffQuery);
  const AssignInstructorMutation = useMutation({
      mutationKey: ["assignInstructor"],
      mutationFn: ({assignment_id,instructor_id}:{assignment_id:string,instructor_id:string})=>assignInstructor(assignment_id,instructor_id),
      onError: () => {
        notification.error({ message: "Instructor Not Assigned" });
      },
      onSuccess: () => {
        notification.success({ message: "Instructor Assigned Successfully" });
        query.refetch()
        staffQuery.refetch()
      },
    });
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  
  const sectionCol: TableColumnsType<SectionFields> = [
    {
      title: "Section Title",
      width: 70,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Enrolled Students",
      dataIndex: "enrolled",
      key: "enrolled",
      fixed: "left",
      width: 70,
    },
    {
      title: "Class Type",
      dataIndex: "type",
      key: "type",
      fixed: "left",
      width: 70,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (record:SectionFields) => {
        return (
          <Select
            showSearch
            placeholder={
              staffQuery.isLoading
                ? "Fetching Instructors"
                : "Assign Instructor"
            }
            onChange={(value) => {
              AssignInstructorMutation.mutate({
                assignment_id:record._id,
                instructor_id:value
              })
            }}
            defaultValue={record.instructor}
            optionFilterProp="children"
            filterOption={filterOption}
            className="w-100"
            disabled={staffQuery.isLoading}
            options={
              staffQuery.isFetched
                ? staffQuery.data?.data?.data?.map((value: StaffFields) => {
                    return {
                      value: value._id,
                      label: `${value.name}: ${value.email}`,
                    };
                  })
                : []
            }
          />
        );
      },
    },
  ];
  const data:SectionFields[] = [];
  if (
    query.isSuccess &&
    query.data?.data
  ) {
    for (let i = 0; i < query.data?.data?.length || 0; i++) {
      data.push({
        key: i.toString(),
        _id: query.data?.data[i]?._id,
        name: query.data?.data[i]?.section_id?.name,
        type: query.data?.data[i]?.Lab_Lec,
        enrolled: query.data?.data[i]?.count,
        instructor: query.data?.data[i]?.instructor_id?._id,
      });
    }
  }
  return (
    <div className="flex gap-5 justify-between mx-5">
      <div className="flex flex-col gap-5 bg-transparent pb-2 ">
        <span className="font-semibold text-lg underline">Sections</span>
        {query.isPending ? (
          <div className="h-auto">
            <Loader />
          </div>
        ) : query.isError ? (
          <>{`${query.error}`}</>
        ) : (
          <Table
            columns={sectionCol}
            dataSource={data} 
            rowKey={(record) => record.key || ""}
            scroll={{ x: 1300 }}
          />
        )}
      </div>
    </div>
  );
}
