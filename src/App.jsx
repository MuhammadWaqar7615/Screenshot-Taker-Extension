// import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import Home from "./pages/Home"
// import Admin from "./pages/admin_panel/AllUsers"
// import Department from "./pages/admin_panel/Department"
// import Roles from "./pages/admin_panel/Roles"
// import Projects from "./pages/admin_panel/Projects"
// import CompanyRegister from "./pages/admin_panel/Companies"
// import Companies from "./pages/admin_panel/Companies"
// import Onboarding from "./pages/admin_panel/onboarding"
// import Screenshots from "./pages/Screenshots"
// import UserDetail from "./pages/UserDetail"

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: '/',
//       element: <Home />
//     },
//     {
//       path: '/screenshots/:id',
//       element: <Screenshots />
//     },
//     {
//       path: '/admin/allusers',
//       element: <Admin />
//     },
//     {
//       path: "/admin/department",
//       element: <Department />
//     },
//     {
//       path: "admin/roles",
//       element: <Roles />
//     },
//     {
//       path: "admin/projects",
//       element: <Projects />
//     },
//     {
//       path: "/admin/registercompany",
//       element: <CompanyRegister />
//     },
//     {
//       path: "/admin/companies",
//       element: <Companies />
//     },
//     {
//       path: "/admin/onboarding",
//       element: <Onboarding />
//     },
//     {
//       path: "/userDetails/:id",
//       element: <UserDetail />
//     }
  
//   ])
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   )
// }

// export default App



//======================================================================================================



// app.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/UserDetail";
import Admin from "./pages/admin_panel/AllUsers";
import Department from "./pages/admin_panel/Department";
import Roles from "./pages/admin_panel/Roles";
import Projects from "./pages/admin_panel/Projects";
import Companies from "./pages/admin_panel/Companies";
import Onboarding from "./pages/admin_panel/Onboarding";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Skills from "./pages/admin_panel/Skills";
import Tasks from "./pages/admin_panel/Tasks";
import Screenshots from "./pages/Screenshots"; // ✅ added import

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <LoginForm /> },
    { path: "/users", element: <Users /> },

    // ✅ Screenshots route added
    {
      path: "/screenshots/:id",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Screenshots />
        </ProtectedRoute>
      ),
    },

    // 🔒 Site Admin routes
    {
      path: "/admin/companies",
      element: (
        <ProtectedRoute allowedRoles={["Site Admin"]}>
          <Companies />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/allusers",
      element: (
        <ProtectedRoute allowedRoles={["Site Admin", "Company Admin"]}>
          <Admin />
        </ProtectedRoute>
      ),
    },

    // 🔒 Company Admin routes
    {
      path: "/admin/onboarding",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin"]}>
          <Onboarding />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/department",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Department />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/roles",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Roles />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/projects",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Projects />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/skills",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Skills />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/tasks",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Tasks />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
