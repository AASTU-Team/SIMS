import AttendanceTable from "./table";
import { useEffect, useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  DatePicker,
  Select,
  Popconfirm,
  notification,
} from "antd";
import type { FormProps } from "antd";
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
import {
  createAttendanceRecord,
  getAttendance,
  updateAttendance,
} from "../../api/attendance";

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

export default function AttendanceManagement() {
  const [open, setOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState(false);
  const [form] = Form.useForm();
  const [records, setRecords] = useState<TableColumnsType>([]);
  const user = useSelector((state: RootState) => state.user);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string[]>(["regular"]);
  const [attendance, setAttendance] = useState<
    { student_id: string; status: string }[]
  >([]);
  const query = useQuery({
    queryKey: ["courseForInstructor"],
    queryFn: () => getCoursesInstructor(user._id),
  });
  // console.log(query);

  const studentQuery = useMutation({
    mutationKey: ["studentForInstructor"],
    mutationFn: (value: string) => getSectionStudent(user._id, value),
  });

  const attendanceQuery = useMutation({
    mutationKey: ["getAttendanceQuery"],
    mutationFn: (value: string) => getAttendance(value, user._id),
  });
  useEffect(() => {
    if (attendanceQuery.isSuccess && attendanceQuery.data?.data) {
      const uniqueDates: { label: string; value: string }[] = [];

      for (let i = 0; i < attendanceQuery.data.data.length; i++) {
        for (
          let j = 0;
          j < attendanceQuery.data.data[i].attendances.length;
          j++
        ) {
          const date = new Date(
            attendanceQuery.data.data[i].attendances[j].date
          );
          const formattedDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

          const bareDate = attendanceQuery.data.data[i].attendances[j].date;

          if (!uniqueDates.some((d) => d.value === formattedDate)) {
            uniqueDates.push({ label: formattedDate, value: bareDate });
          }
        }
      }

      // console.log("Unique Dates",uniqueDates);
      const col: TableColumnsType = uniqueDates.map(({ label, value }) => {
        return {
          title: label,
          width: 150,
          dataIndex: label,
          key: label,
          fixed: false,
          render(text, record: { _id: string; name: string }) {
            return (
              <Select
                placeholder="Select Attendance"
                defaultValue={
                  attendanceQuery.data.data
                    .find(
                      (student: { student_id: string }) =>
                        student.student_id === record._id
                    )
                    ?.attendances.find(
                      (attend: { date: string }) => attend.date === value
                    )?.status
                }
                onChange={(status: string) => {
                  const attendance_id = attendanceQuery.data.data
                    .find((student: { student_id: string }) => student.student_id === record._id)?._id
                  const _id = attendanceQuery.data.data
                  .find((student: { student_id: string }) => student.student_id === record._id)
                  ?.attendances.find(
                    (attend: { date: string }) => attend.date === value
                  )?._id;

                  editAttendanceMutation.mutate({ attendance_id , status, date:label, _id });
                }}
                options={[
                  {
                    value: "Present",
                    label: "Present",
                  },
                  {
                    value: "Absent",
                    label: "Absent",
                  },
                ]}
              />
            );
          },
        };
      });

      setRecords(col);
    }
  }, [attendanceQuery.isSuccess]);

  console.log("Student Query", studentQuery);

  const createAttendanceMutation = useMutation({
    mutationKey: ["createAttendanceRecord"],
    mutationFn: (date: string) =>
      createAttendanceRecord(selectedCourse, user._id, date, attendance),
    onError: () => {
      notification.error({ message: "Record not saved" });
    },
    onSuccess: () => {
      notification.success({ message: "Record Saved Successfully" });
      setAttendance([]);
      query.refetch();
    },
  });

  const editAttendanceMutation = useMutation({
    mutationKey: ["editAttendanceRecord"],
    mutationFn: ({
      attendance_id,
      status,
      date,
      _id,
    }: {
      attendance_id: string;
      status: string;
      date: string;
      _id: string;
    }) => updateAttendance(attendance_id, status, date, _id),
    onError: () => {
      notification.error({ message: "Record not updated" });
    },
    onSuccess: () => {
      notification.success({ message: "Record Updated Successfully" });
      query.refetch();
    },
  });

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

  const onDelete = (date: string) => {
    const updatedRecords = records.filter((record) => record.key !== date);
    setRecords(updatedRecords);
    setActiveRecord(false);
  };

  const onFinish: FormProps["onFinish"] = (values) => {
    const formattedDate = new Date(values.record_date)
      .toISOString()
      .split("T")[0];

    const col: TableColumnsType = [
      {
        title: (
          <div className="flex gap-2 items-center">
            {formattedDate}
            <Popconfirm
              title="Delete this record"
              description="Are you sure to delete this record?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(formattedDate)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
            <Popconfirm
              title="Submit this record"
              description="Are you sure to submit this record?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => createAttendanceMutation.mutate(formattedDate)}
            >
              <Button>Submit</Button>
            </Popconfirm>
          </div>
        ),
        width: 150,
        dataIndex: formattedDate,
        key: formattedDate,
        fixed: false,
        render(text, record) {
          return (
            <Select
              placeholder="Select Attendance"
              onChange={(value: string) => {
                setAttendance((prevAttendance) => {
                  const updatedAttendance = [...prevAttendance];
                  const existingIndex = updatedAttendance.findIndex(
                    (item) => item.student_id === record._id
                  );
                  if (existingIndex !== -1) {
                    updatedAttendance[existingIndex] = {
                      student_id: record._id,
                      status: value,
                    };
                  } else {
                    updatedAttendance.push({
                      student_id: record._id,
                      status: value,
                    });
                  }
                  // console.log("Update Att",updatedAttendance)
                  return updatedAttendance;
                });
                // console.log("Attendance",attendance);
              }}
              options={[
                {
                  value: "Present",
                  label: "Present",
                },
                {
                  value: "Absent",
                  label: "Absent",
                },
              ]}
            />
          );
        },
      },
    ];
    setRecords([...records, ...col]);
    form.resetFields();
    setActiveRecord(true);
    setOpen(false);
  };

  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const data: CourseFields[] = [];
  if (query.isSuccess && query.data?.data) {
    const uniqueData: CourseFields[] = [];
    const existingIds: string[] = [];

    for (let i = 0; i < query.data.data.length; i++) {
      const courseId = query.data?.data[i]?.course_id?._id;
      if (courseId && !existingIds.includes(courseId)) {
        existingIds.push(courseId);
        uniqueData.push({
          _id: courseId,
          name: query.data?.data[i]?.course_id?.name,
        });
      }
    }

    data.push(...uniqueData);
    if (!selectedCourse && data.length > 0) {
      setSelectedCourse(data[0]?._id || "");
      studentQuery.mutate(data[0]?._id || "");
      attendanceQuery.mutate(data[0]?._id || "");
    }
    // const newSelectedCourse = data[0]?._id || "";
    // setSelectedCourse(newSelectedCourse);
  }
  console.log("Attendance Query", attendanceQuery.data);

  const studentData: SectionData[] = [];
  const sections: { id: string; name: string }[] = [];
  if (studentQuery.isSuccess && query.data?.data) {
    const uniqueData: SectionData[] = [];
    const existingIds: string[] = [];
    // console.log("Student Query Data",studentQuery.data.data);
    for (let i = 0; i < studentQuery.data.data.length; i++) {
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

  return (
    <div className="max-w-screen-3xl p-4 md:p-6 2xl:p-10">
      <div className="flex justify-between">
        <div className="text-title-md">Attendance Management</div>
        <div className="flex gap-4 items-start justify-start">
          <Select
            showSearch
            className=" h-10 w-80"
            placeholder={query.isLoading ? "Fetching Courses" : "Select Course"}
            optionFilterProp="children"
            onChange={(value: string) => {
              // console.log(value);
              setSelectedCourse(value);
              studentQuery.mutate(value);
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

          <button
            onClick={() => {
              if (activeRecord === true) {
                notification.error({
                  message: "Please submit the open record first",
                });
              } else {
                setOpen(true);
              }
            }}
            className="flex justify-center items-center h-fit gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            <FileAddOutlined />
            Add Record
          </button>
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
        columns={[
          ...columns.map((column) => ({ ...column, fixed: undefined })),
          ...records,
        ]}
      />
      <Modal
        centered
        open={open}
        onOk={() => {
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        title="Add Record"
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            className="bg-primary"
          >
            Create
          </Button>,
        ]}
      >
        {/* <div className="flex justify-center items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
        <Form
          name="semester registration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <div className="flex gap-6 justify-center items-start">
            <div className="">
              <Form.Item
                name="record_date"
                rules={[
                  {
                    required: true,
                    message: "Please input the Date of the Record!",
                  },
                ]}
              >
                <div>
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="record_date"
                  >
                    Record Date
                  </label>
                  <DatePicker
                    className=" rounded-lg w-100 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(value) => {
                      const date = value ? value.format("YYYY-MM-DD") : null;
                      form.setFieldValue("record_date", date);
                    }}
                  />
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
        {/* </div> */}
      </Modal>
    </div>
  );
}
