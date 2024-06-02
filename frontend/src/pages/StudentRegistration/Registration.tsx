// import { useQuery } from "@tanstack/react-query";
import {  Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import RegistrationSlip from "./RegistrationSlip";

const { confirm } = Modal;

const showConfirm = () => {
  confirm({
    title: "Are you sure you want to register?",
    icon: <ExclamationCircleFilled />,
    content: "Make sure all the details are correct. Any problems can be addressed at the registrar office.",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};


export default function Registration() {
    //   const query = useQuery({
    //     queryKey: ["myCourse"],
    //     queryFn: ?,
    //   });
    

   const details ={
    stream: "Software Engineering",
    classification: "Regular",
    program: "Masters",
    year: "1",
    sem: "I",
    ac_year: "2023/2024"
   }
  return (
    <div className="pt-1 flex flex-col gap-5">
      <RegistrationSlip details={details} />
      <div className="flex justify-end mr-5">
        <button
          className="flex justify-center w-30 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-gray  hover:bg-opacity-90"
          onClick={showConfirm}
        >
          Register
        </button>
      </div>
    </div>
  );
}
