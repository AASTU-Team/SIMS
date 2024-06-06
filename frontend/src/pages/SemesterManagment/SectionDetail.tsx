import { Select, Table, TableColumnsType } from "antd";
import { CourseFields } from "../../type/course";
import { SectionFields } from "../../type/registration";

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
  console.log(semester, course);
  const sections:SectionFields[] = [
    {
      key: "1",
      name: "A",
      enrolled: "30",
      staff: "Asseffa Lemma",
    },
    {
      key: "2",
      name: "B",
      enrolled: "30",
    },
  ];
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
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 200,
      render: (record:SectionFields) => {
        return (
          <Select
            showSearch
            placeholder="Assign Staff"
            optionFilterProp="children"
            className="w-50"
            defaultValue={record?.staff}
            options={[
              {
                value: "Asseffa Lemma",
                label: "Asseffa Lemma",
              },
              {
                value: "Solomon Tesfa",
                label: "olomon Tesfa",
              },
            ]}
          />
        );
    },}
  ];
  return (
    <div className="flex gap-5 justify-between mx-5">
      <div className="flex flex-col gap-5 bg-transparent pb-2 ">
        <span className="font-semibold text-lg underline">Sections</span>
          <Table
            columns={sectionCol}
            dataSource={sections}
            scroll={{ x: 1500 }}
          />
      </div>
    </div>
  );
}
