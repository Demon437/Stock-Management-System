import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogIn,
  FiActivity,
  FiAlertTriangle,
  FiDatabase,
  FiFileText,
} from "react-icons/fi";


const roleBasePath = {
admin: "admin-dashboard",
storekeeper: "storekeeper-dashboard",
supervisor: "supervisor-dashboard",
staff: "staff-dashboard",
}

const Reports = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"))

  const basePath = roleBasePath[user?.role]

  const cards = [
    {
      title: "Login Activity",
      desc: "View all user login/logout history",
      icon: <FiLogIn />,
      path: `/${basePath}/login-activity`,
      color: "bg-cyan-500",
    },
    {
      title: "System Logs",
      desc: "All system level activities",
      icon: <FiDatabase />,
      path: `/${basePath}/system-logs`,
      color: "bg-[#0F172A]",
    },
    {
      title: "Stock Activity",
      desc: "All stock in/out movements",
      icon: <FiActivity />,
      path: `/${basePath}/stock-activity`,
      color: "bg-green-500",
    },
    {
      title: "Low Stock",
      desc: "Products below threshold level",
      icon: <FiAlertTriangle />,
      path: `/${basePath}/low-stock`,
      color: "bg-red-500",
    },
    {
      title: "Full Report Export",
      desc: "Generate complete system report",
      icon: <FiFileText />,
      path: `/${basePath}/export`,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="page-bg">
      <div className="page-container">

        <div className="card-header">
          <h1 className="page-heading text-4xl">
            Reports Center
          </h1>
          <p className="page-subheading">
            Manage and access all system reports from one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="cursor-pointer card-padded hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">

                <div
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-xl text-xl ${card.color}`}
                >
                  {card.icon}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">
                    {card.title}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {card.desc}
                  </p>
                </div>

              </div>

              <div className="mt-5 text-sm text-cyan-600 font-medium">
                Open Report →
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Reports
