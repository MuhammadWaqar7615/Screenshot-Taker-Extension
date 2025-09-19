import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "All companies", path: "/admin/companies" },
    { name: "All users", path: "/admin/allusers" },
    { name: "Department", path: "/admin/department" },
    { name: "Roles", path: "/admin/roles" },
    { name: "Projects", path: "/admin/projects" },
  ];

  return (
    <aside className="w-[18%] bg-white shadow-md p-4 border-r min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Admin Panel</h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className={`block p-2 rounded-md transition ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
