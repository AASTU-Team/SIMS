const NumberOfStudent = require("../models/numberOfStudent.model");

async function incStudentNumber(
  id: string,
  course: string,
  stud_id: string,
  isOutOfBatch: Boolean = false
) {
  const number = await NumberOfStudent.findOne({
    section_id: id,
    course_id: course,
  });
  console.log(number);
  if (number) {
    const student = number.numberOfStudent.find((item: any) => {
      console.log("start", item.student.toString(), stud_id);
      return item.student.toString() === stud_id.toString();
    });
    console.log("start", student, stud_id, "end");
    if (student) {
      console.log("student exists");
      return;
    }
    number.numberOfStudent.push({ student: stud_id, isOutOfBatch });
    await number.save();
    return;
  } else {
    const numstud = await NumberOfStudent.create({
      course_id: course,
      section_id: id,
      numberOfStudent: [{ student: stud_id, isOutOfBatch }],
    });
    await numstud.save();
  }
}

module.exports = incStudentNumber;
