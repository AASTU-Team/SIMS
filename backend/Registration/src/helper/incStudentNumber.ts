const NumberOfStudent = require("../models/numberOfStudent.model");

async function incStudentNumber(id: string, course: string, stud_id: string) {
  const number = await NumberOfStudent.findOne({
    section_id: id,
    course_id: course,
  });

  if (number) {
    if (number.numberOfStudent.includes(stud_id)) {
      console.log(number.numberOfStudent.includes(stud_id));
      return;
    }
    number.numberOfStudent.push(stud_id);
    await number.save();
    return;
  } else {
    const numstud = await NumberOfStudent.create({
      course_id: course,
      section_id: id,
      numberOfStudent: [stud_id],
    });
    await numstud.save();
  }
}

module.exports = incStudentNumber;
