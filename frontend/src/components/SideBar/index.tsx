/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import DashboardIcon from "../../assets/sidebar/DashboardIcon";
import StudentIcon from "../../assets/sidebar/StudentIcon";
import StaffIcon from "../../assets/sidebar/StaffIcon";
import {InsertRowLeftOutlined,CalendarOutlined, BookOutlined, ProfileOutlined } from "@ant-design/icons";
import { staffSideBarData, studentSideBarData } from "./data";
import CalendarIcon from "../../assets/sidebar/CalendarIcon";
import "../../App.css"

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Icon = [
  {
    index: 0,
    name: "home",
    component: <DashboardIcon key="0" />,
  },
  {
    index: 1,
    name: "student",
    component: <StudentIcon key="1" />,
  },
  {
    index: 2,
    name: "user",
    component: <StaffIcon key="2" />,
  },
  {
    index: 3,
    name: "staff",
    component: <StaffIcon key="3" />,
  },
  {
    index: 4,
    name: "book",
    component: <BookOutlined key="4" />,
  },
  {
    index: 5,
    name: "plans",
    component: <ProfileOutlined key="5" />,
  },
  {
    index: 6,
    name: "building",
    component: <ProfileOutlined key="6" />,
  },
  {
    index: 7,
    name: "room",
    component: <InsertRowLeftOutlined key="7" />,
  },
  {
    index: 8,
    name: "semester",
    component: <CalendarOutlined key="8" />,
  },
  {
    index: 9,
    name: "calendar",
    component: <CalendarIcon key="9" />,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = useLocation().pathname;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = "true";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const user = useSelector((state: RootState) => state.user);
  const data = user.roles.includes("student")? studentSideBarData: staffSideBarData;
  
  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-75  flex-col overflow-y-hidden bg-boxdark duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 pt-5.5 lg:pt-6.5">
        <Link
          to="/"
          className="flex gap-3 justify-between align-middle items-center"
        >
          <img
            width={50}
            height={32}
            src={"/images/logo.jpg"}
            alt="Logo"
            className="rounded-2xl"
          />
          <div className="text-title-lg text-white">SIMS</div>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="custom-scrollbar scrollbar-none flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-3 pr-4 py-4 lg:mt-9 lg: pr-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {data.map((item) => {
                if (user.roles.includes(item.role) || item.role === "") {
                  return (
                    <li key={item.index}>
                      <Link
                        key={item.index}
                        to={item.link}
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 text-md  duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(item.link) &&
                          item.link != "/" &&
                          "bg-graydark dark:bg-meta-4 border-l-2 border-white"
                        }`}
                      >
                        {Icon.map((icon) => {
                          if (item.icon === icon.name) {
                            return icon.component;
                          }
                        })}

                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
