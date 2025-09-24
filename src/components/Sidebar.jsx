import { Link, useLocation } from "react-router-dom";
import { FaBuilding, FaUsers, FaSitemap, FaUserShield, FaProjectDiagram } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "All companies", path: "/admin/companies", icon: <FaBuilding /> },
    { name: "All users", path: "/admin/allusers", icon: <FaUsers /> },
    { name: "Department", path: "/admin/department", icon: <FaSitemap /> },
    { name: "Roles", path: "/admin/roles", icon: <FaUserShield /> },
    { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram /> },
  ];

  return (
    <aside className="w-[18%] bg-gray-800 shadow-lg p-4 border-r border-gray-700 min-h-screen flex flex-col">
      <h2 className="text-xl font-bold text-gray-100 mb-6">Admin Panel</h2>
      <ul className="flex-1 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-200 hover:bg-gray-700 hover:text-white ${
                location.pathname === link.path
                  ? "bg-blue-600 text-white font-semibold"
                  : ""
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}