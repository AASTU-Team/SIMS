// import { useQuery } from "@tanstack/react-query";
import { Modal, notification } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import RegistrationSlip from "./RegistrationSlip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmRegistration } from "../../api/student";
import { useQuery } from "@tanstack/react-query";
import { getRegisteredCourse } from "../../api/student";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Loader from "../../components/Loader";
const { confirm } = Modal;

export default function Registration() {
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["regCourses"],
    queryFn: () => getRegisteredCourse(user._id),
  });
  console.log(query)

  const registerCourseMutation = useMutation({
    mutationKey: ["registerCourses"],
    mutationFn: () => confirmRegistration(user._id),
    onError: () => {
      notification.error({ message: "Registration Unsuccessful" });
    },
    onSuccess: () => {
      notification.success({ message: "Registration Successfully" });
    },
  });

  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to register?",
      icon: <ExclamationCircleFilled />,
      content:
        "Make sure all the details are correct. Any problems can be addressed at the registrar office.",
      onOk() {
        registerCourseMutation.mutate();
        queryClient.invalidateQueries({ queryKey: ["regCourses"]});
      },
      okText: "Confirm",
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  
  return (
    <div className="pt-1 flex flex-col gap-5">
      {query.isPending ? (
        <div className="">
          <Loader />
        </div>
      ) : query.isError ? (
        <>{`${query.error}`}</>
      ) : query?.data?.data?.message === "Inactive" ? (
        <div>Registration is Closed.</div>
      ) : query?.data?.data?.status === "Student" ? (
        <div className="font-medium">Your registration is being processed by your department.</div>
      ) : query?.data?.data?.status === "Department" ? (
        <div>Your registration is being processed by the registrar.</div>
      ) : query?.data?.data?.status === "Registrar" ? (
        <div>Your registration has been approved.</div>
      ) : (
        <div>
          <RegistrationSlip data={query?.data?.data?.message || []} />
          <div className="flex justify-end mr-5">
            <button
              className="flex justify-center w-30 items-center mt-2 gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray  hover:bg-opacity-90"
              onClick={showConfirm}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
