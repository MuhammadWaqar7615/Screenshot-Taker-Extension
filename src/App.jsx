import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Admin from "./pages/admin_panel/AllUsers"
import Department from "./pages/admin_panel/Department"
import Roles from "./pages/admin_panel/Roles"
import Projects from "./pages/admin_panel/Projects"
import CompanyRegister from "./pages/admin_panel/Companies"
import Companies from "./pages/admin_panel/Companies"
import Onboarding from "./pages/admin_panel/onboarding"
import Screenshots from "./pages/Screenshots"

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/screenshots',
      element: <Screenshots />
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
    },
    {
      path: "/admin/onboarding",
      element: <Onboarding />
    },
  
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
