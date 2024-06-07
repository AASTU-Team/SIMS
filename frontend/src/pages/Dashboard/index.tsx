import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import StudentDashboard from "./studentDashboard";
import StaffDashboard from "./staffDashboard";

export default function Dashboard() {

  const user = useSelector((state: RootState) => state.user)
  
  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {
        user.role === "Student" ? <StudentDashboard/> : <StaffDashboard/>
      }
      
    </div>
  );
}

