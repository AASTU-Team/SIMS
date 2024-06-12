import AttendanceTable from "./table";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  notification,
  Select,
} from "antd";
import type { TableColumnsType } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCoursesInstructor,
  getSectionStudent,
} from "../../api/registration";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { CourseFields } from "../../type/course";
import { StudentFields } from "../../type/student";
import { getAllStudentsWithAssessmentsAndGrades, submitApproval, updateGradeAssessment } from "../../api/grade";


interface SectionData {
  name: string;
  id: string;
  students: {
    studentId: string;
    name: string;
    _id: string;
    isOutofBatch: boolean;
  }[];
}

interface StudentsType {
  studentId: string;
  name: string;
  _id: string;
  isOutofBatch: boolean;
}

export default function AttendanceManagement() {
  const user = useSelector((state: RootState) => state.user);
  const [records, setRecords] = useState<TableColumnsType>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string[]>(["regular"]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: StudentsType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows.map((value) => value._id)
      );
      setSelectedStudents(selectedRows.map((value) => value._id));
    },
  };
  
  const query = useQuery({
    queryKey: ["courseForInstructor"],
    queryFn: () => getCoursesInstructor(user._id),
  });
  console.log("Course Query",query);
   const studentQuery = useMutation({
     mutationKey: ["studentForInstructor"],
     mutationFn: (value: string) => getSectionStudent(user._id, value),
   });

  const gradeQuery = useMutation({
        mutationKey: ["gradeForInstructor"],
        mutationFn: (value: string) => getAllStudentsWithAssessmentsAndGrades(user._id,value),
      });
  const UpdateGrade = useMutation({
    mutationKey: ["addStudent"],
    mutationFn: ({gradeId,assessmentId,value}:{gradeId:string,assessmentId:string,value:number}) => updateGradeAssessment(gradeId,assessmentId,value),
    onError: () => {
      notification.error({ message: "Grade Not Updated" });
    },
    onSuccess: () => {
      notification.success({ message: "Grade Updated Successfully" });
    },
  });

  const confirmRequest = useMutation({
    mutationKey: ["sendGradeRequest"],
    mutationFn: () => submitApproval(user._id,selectedCourse, selectedStudents),
    onError: () => {
      notification.error({ message: "Grade Not Submitted" });
    },
    onSuccess: () => {
      notification.success({ message: "Grade Submitted Successfully" });
    },
  });

  const data: CourseFields[] = [];
  if (query.isSuccess && query.data?.data) {
    const uniqueData: CourseFields[] = [];
    const existingIds: string[] = [];

    for (let i = 0; i < query.data?.data?.length; i++) {
      const courseId = query.data?.data[i]?.course_id?._id;
      if (courseId && !existingIds.includes(courseId)) {
        existingIds.push(courseId);
        // console.log("Assessments",query.data?.data[i]?.course_id?.assessments);
        uniqueData.push({
          _id: courseId,
          name: query.data?.data[i]?.course_id?.name,
          assessments: [...(query.data?.data[i]?.course_id?.assessments||[])]
        });
      }
    }

    data.push(...uniqueData);
    if (!selectedCourse && data.length > 0) {
      // console.log("Data", data);
      setSelectedCourse(data[0]?._id || "");
      studentQuery.mutate(data[0]?._id || "");
      gradeQuery.mutate(data[0]?._id || "");
    }
    // const newSelectedCourse = data[0]?._id || "";
    // setSelectedCourse(newSelectedCourse);
  }

 

  // const gradeQuery = useMutation({
  //   mutationKey: ["getAttendanceQuery"],
  //   mutationFn: (value: string) => getAttendance(value, user._id),
  // });
  // const editAttendanceMutation = useMutation({
  //   mutationKey: ["editAttendanceRecord"],
  //   mutationFn: ({
  //     attendance_id,
  //     status,
  //     date,
  //     _id,
  //   }: {
  //     attendance_id: string;
  //     status: string;
  //     date: string;
  //     _id: string;
  //   }) => updateAttendance(attendance_id, status, date, _id),
  //   onError: () => {
  //     notification.error({ message: "Record not updated" });
  //   },
  //   onSuccess: () => {
  //     notification.success({ message: "Record Updated Successfully" });
  //     query.refetch();
  //   },
  // });

  useEffect(() => {
    studentQuery.mutate(selectedCourse);
    gradeQuery.mutate(selectedCourse);
    setSelectedSection(sections[0]?.id || "");
  },[selectedCourse,UpdateGrade.isSuccess])

  useEffect(() => {
    if (selectedCourse) {
      const col: TableColumnsType = data
        .find((course) => course._id === selectedCourse)?.assessments?.map(({ name,value,_id }) => {
          const max_value = value;
          return {
              title: `${name} (${max_value})`,
              width: 150,
              dataIndex: name,
              key: name,
              fixed: false,
              render(text, record: { _id: string; name: string }) {
                const value = gradeQuery.data?.data
                  ?.find(
                    (value: { studentId: string }) =>
                      value.studentId === record._id
                  )
                  ?.assessments?.find(
                    (value: { assessment_id: string }) =>
                      value.assessment_id === _id
                  )?.marks_obtained;
                // console.log(value) 
                if(value!==undefined){
                return (
                  <Input
                    placeholder={`Enter ${name}`}
                    type="number"
                    onBlur={(e) => {
                      const gradeId = gradeQuery.data?.data?.find(
                        (value: { studentId: string }) =>
                          value.studentId === record._id
                      )?.gradeId;
                      const newValue = parseInt(e.target.value);
                      if (newValue >= 0 && newValue <= (max_value || 100)) {
                        UpdateGrade.mutate({
                          gradeId: gradeId,
                          assessmentId: _id || "",
                          value: newValue,
                        });
                      } else {
                        notification.error({ message: "Invalid grade value" });
                      }
                    }}
                    disabled={
                      gradeQuery.data?.data?.find(
                        (value: { studentId: string }) =>
                          value.studentId === record._id
                      )?.approval_status !== "Uninitiated" &&
                      gradeQuery.data?.data?.find(
                        (value: { studentId: string }) =>
                          value.studentId == record._id
                      )?.approval_status !== "Rejected"
                    }
                    defaultValue={value}
                  />
                );}
              },
          };
        }) || [];
      
      setRecords(col);
      // console.log("Records",data);

    }
  }, [selectedCourse,gradeQuery.isSuccess,gradeQuery.data?.data]);

  console.log("Student Query", studentQuery);
  console.log("Grade Query", gradeQuery);


  const columns = [
    {
      title: "Student Name",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
    },
    {
      title: "Student ID",
      width: 150,
      dataIndex: "studentId",
      key: "studentId",
      fixed: "left",
      sorter: true,
    },
  ];



  


  const studentData: SectionData[] = [];
  const sections: { id: string; name: string }[] = [];
  if (studentQuery.isSuccess && query.data?.data) {
    const uniqueData: SectionData[] = [];
    const existingIds: string[] = [];
    // console.log("Student Query Data",studentQuery.data.data);
    for (let i = 0; i < studentQuery.data?.data?.length; i++) {
      const sectionId = studentQuery.data?.data[i]?.section_id?._id;
      // console.log(sectionId)
      if (sectionId && !existingIds.includes(sectionId)) {
        sections.push({
          id: sectionId,
          name: studentQuery.data?.data[i]?.section_id?.name,
        });
        existingIds.push(sectionId);
        uniqueData.push({
          id: sectionId,
          name: studentQuery.data?.data[i]?.section_id?.name,
          students:
            studentQuery.data?.data[i]?.numberOfStudent?.map(
              (value: { isOutOfBatch: boolean; student: StudentFields }) => {
                return {
                  studentId: value?.student?.id,
                  name: value?.student?.name,
                  _id: value?.student?._id,
                  isOutofBatch: value?.isOutOfBatch,
                };
              }
            ) || [],
        });
      }
    }
    // console.log("Unique Data",uniqueData);
    studentData.push(...uniqueData);
    // console.log("Student Data",studentData);

    if (!selectedSection && sections.length > 0) {
      setSelectedSection(sections[0]?.id || "");
    }

    // console.log("Student Data",studentData);
    // console.log("Sections",sections);
    // console.log(selectedSection)
    // console.log("Students Data",
    //   studentData
    //     .filter((value) => value.id === selectedSection)
    //     .map((value) => value.students)
    //     .flat()
    //     .filter((student) => {
    //       if (selectedType.includes("regular") && selectedType.includes("add")) {
    //         return true;
    //       } else if (selectedType.includes("regular")) {
    //         return student.isOutofBatch === false;
    //       } else if (selectedType.includes("add")) {
    //         return student.isOutofBatch === true;
    //       } else {
    //         return false;
    //       }
    //     })
    // );
  }
  // console.log("section",selectedSection,sections)
  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Grade Management</div>
        <div className="flex gap-4 items-start justify-start">
          <Button
            className="h-10"
            disabled={confirmRequest.isPending || selectedStudents.length == 0}
            type="primary"
            onClick={() => {
              confirmRequest.mutate();
            }}
          >
            Submit Grades
          </Button>
          <Select
            showSearch
            className=" h-10 w-80"
            placeholder={query.isLoading ? "Fetching Courses" : "Select Course"}
            optionFilterProp="children"
            onChange={(value: string) => {
              // console.log(value);
              setSelectedCourse(value);
              studentQuery.mutate(value);
              gradeQuery.mutate(value);
            }}
            value={
              selectedCourse
                ? selectedCourse
                : query.isFetched && data.length > 0
                ? data[0]?._id
                : undefined
            }
            options={
              query.isFetched
                ? data?.map((value: CourseFields) => {
                    return {
                      value: value._id,
                      label: value.name,
                    };
                  })
                : []
            }
          />
          <Select
            showSearch
            placeholder="Select Section"
            optionFilterProp="children"
            className=" h-10 w-50"
            onChange={(value: string) => {
              // console.log(value);
              setSelectedSection(value);
            }}
            value={
              selectedSection
                ? selectedSection
                : studentQuery.isSuccess && sections.length > 0
                ? sections[0]?.id
                : undefined
            }
            options={
              studentQuery.isSuccess
                ? sections?.map((value: { id: string; name: string }) => {
                    return {
                      value: value.id,
                      label: value.name,
                    };
                  })
                : []
            }
          />
          <Select
            showSearch
            placeholder="Select Admission Type"
            optionFilterProp="children"
            mode="multiple"
            className=" h-10 w-50"
            value={selectedType}
            onChange={(value: string[]) => {
              // console.log(value);
              setSelectedType(value);
            }}
            options={[
              {
                value: "regular",
                label: "Regular",
              },
              {
                value: "add",
                label: "Add",
              },
            ]}
          />
        </div>
      </div>
      <AttendanceTable
        data={
          studentData
            .filter((value) => value.id === selectedSection)
            .map((value) => value.students)
            .flat()
            .filter((student) => {
              if (
                selectedType.includes("regular") &&
                selectedType.includes("add")
              ) {
                return true;
              } else if (selectedType.includes("regular")) {
                return student.isOutofBatch === false;
              } else if (selectedType.includes("add")) {
                return student.isOutofBatch === true;
              } else {
                return false;
              }
            }) || []
        }
        rowSelection={rowSelection}
        columns={[
          ...columns.map((column) => ({ ...column, fixed: undefined })),
          ...records,
        ]}
      />
    </div>
  );
}
