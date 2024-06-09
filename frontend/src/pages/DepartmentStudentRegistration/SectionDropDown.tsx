import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { getCourseSections } from "../../api/registration";
import { SectionFields } from "../../type/registration";

export default function SectionDropDown({
  course_id,
  batch,
  semester,
  setAssignment,
  assignment,
}: {
  course_id: string;
  batch: number;
  semester: number;
  setAssignment: React.Dispatch<
    React.SetStateAction<{ course_id: string; section_id: string }[]>
  >;
  assignment: { course_id: string; section_id: string }[];
}) {
  const query = useQuery({
    queryKey: ["batchCoursesSection"],
    queryFn: () => getCourseSections(course_id, batch, semester),
  });

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const data: SectionFields[] = [];
  if (query.isSuccess && query.data?.data) {
    const sectionIds = new Set<string>();
    for (let i = 0; i < query.data?.data?.length || 0; i++) {
      const sectionId = query.data?.data[i]?.section_id?._id;
      if (sectionId && !sectionIds.has(sectionId)) {
        sectionIds.add(sectionId);
        data.push({
          key: i.toString(),
          _id: query.data?.data[i]?._id,
          name: query.data?.data[i]?.section_id?.name,
          section_id: sectionId,
          enrolled: query.data?.data[i]?.count,
        });
      }
    }
  }
  return (
    <div className=" font-semibold w-auto">
      <Select
        showSearch
        placeholder={query.isLoading ? "Fetching Section" : "Assign Section"}
        onChange={(value) => {
          setAssignment(() => {
            const existingAssignment = assignment.find(
              (item) => item.course_id === course_id
            );
            if (existingAssignment) {
              const updatedAssignment = assignment.map((item) => {
                if (item.course_id === course_id) {
                  return { ...item, section_id: value };
                }
                return item;
              });
              return updatedAssignment;
            } else {
              return [...assignment, { course_id, section_id: value }];
            }
          });
        }}
        optionFilterProp="children"
        filterOption={filterOption}
        disabled={query.isLoading}
        options={data.map((value: SectionFields) => {
          return {
            value: value.section_id || value._id,
            label: `${value.name}: ${value.enrolled}`,
          };
        })}
      />
    </div>
  );
}
