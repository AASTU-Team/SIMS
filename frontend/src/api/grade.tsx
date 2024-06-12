import type { AxiosResponse } from "axios";
import axios from "axios";
import getCookie from "../hooks/getCookie";
import setCookie from "../hooks/setCookie";

const client = axios.create({
  baseURL: "http://localhost:3005/",
});

const authClient = axios.create({
  baseURL: "http://localhost:5000/auth",
});

export const setHeaderToken = (token: string) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
  //client.defaults.headers.common.Authorization = null;
  delete client.defaults.headers.common.Authorization;
};

export const fetchNewToken = async () => {
  try {
    const token = getCookie("refresh_token") || "";
    authClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await authClient.post("/refresh");
    const new_token = res.data.accessToken;
    // console.log(new_token)
    return new_token;
  } catch (error) {
    return null;
  }
};

export const refreshAuth = async (failedRequest: {
  response: AxiosResponse;
}) => {
  const newToken = await fetchNewToken();

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    setHeaderToken(newToken);
    setCookie("access_token", newToken, 30);
    return Promise.resolve(newToken);
  } else {
    return Promise.reject();
  }
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAuth(error);
        return client(originalRequest);
      } catch (error) {
        removeHeaderToken();
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }

      return Promise.reject(error);
    }
  }
);



export const getStudentGrade = async (student_id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/grades/${student_id}`);
};

export const sendImageForRegistration = async (
  id: string,
  file: File | null
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);

  const formData = new FormData();
  formData.append("id", id);
  if (file) {
    formData.append("file", file);
  }

  return await client.post(`/student/withdrawalRequest`, formData);
};

export const updateGradeAssessment = async (gradeId: string, assessmentId: string,value:number) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.put(`/grades/${gradeId}/assessments/${assessmentId}`,{marks_obtained:value});
};

export const getStudentCourseGrade = async (student_id: string, course_id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/grades/${student_id}/${course_id}`);
};

export const getAllStudentsWithAssessmentsAndGrades = async (
  instructor_id: string,
  course_id?: string,
  section_id?: string,
  semester?: string,
  year?: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/instructor/${instructor_id}/courses`, {
    params: {
      courseId: course_id,
      sectionId: section_id,
      semester: semester,
      year: year,
    },
  });
};

export const getAllStudentsWithAssessmentsForCourse = async (course_id: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/courses/${course_id}/students`);
};

export const submitApproval = async (
  instructorId: string,
  courseId: string,
  listOfStudents: string[]
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/approval/submit", {instructorId, courseId, listOfStudents});
};

export const approveGradeByDepartment = async (approvalId: string, approvedBy: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.put(`/approval/department/${approvalId}`, {
    approvedBy,
    status:"Approved"
  });
};

export const rejectGradeByDepartment = async (approvalId: string, rejectedBy: string, reason: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.put(`/approval/department/${approvalId}`, {
    rejectedBy,
    reason,
    status:"Rejected"
  });
};

export const approveGradeByDean = async (approvalId: string, approvedBy: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.put(`/approval/dean/${approvalId}`, {
    approvedBy,
    status:"Approved"
  });
};

export const rejectGradeByDean = async (approvalId: string, rejectedBy: string, reason: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.put(`/approval/dean/${approvalId}`, {
    rejectedBy,
    reason,
    status:"Rejected"
  });
};

export const bulkApproveGradesByDepartment = async (
  approvalIds: string[],
  approvedBy: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/approval/department/bulk", {
    approvalIds,
    approvedBy,
  });
};

export const bulkApproveGradesByDean = async (
  approvalIds: string[],
  approvedBy: string
) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.post("/approval/dean/bulk", {
    approvalIds,
    approvedBy,
  });
};

export const getApprovalStatus = async (approvalId: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/approval/status/${approvalId}`);
};

export const getApprovalStatusByGradeId = async (gradeId: string) => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get(`/approval/status/grade/${gradeId}`);
};

export const getDepartmentRequests = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("/approval/department/requests");
};

export const getDeanRequests = async () => {
  const access_token = getCookie("access_token") || "";
  setHeaderToken(access_token);
  return await client.get("/approval/dean/requests");
};