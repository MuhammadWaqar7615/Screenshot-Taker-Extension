import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Users from "./pages/Users"
import Admin from "./pages/admin_panel/AllUsers"
import Department from "./pages/admin_panel/Department"
import Roles from "./pages/admin_panel/Roles"
import Projects from "./pages/admin_panel/Projects"
import CompanyRegister from "./pages/admin_panel/Companies"
import Companies from "./pages/admin_panel/Companies"

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/users',
      element: <Users />
    },
    {
      path: '/admin/allusers',
      element: <Admin />
    },
    {
      path: "/admin/department",
      element: <Department />
    },
    {
      path: "admin/roles",
      element: <Roles />
    },
    {
      path: "admin/projects",
      element: <Projects />
    },
    {
      path: "/admin/registercompany",
      element: <CompanyRegister />
    },
    {
      path: "/admin/companies",
      element: <Companies />
    }
  
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
