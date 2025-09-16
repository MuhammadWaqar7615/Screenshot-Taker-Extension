import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Users from "./pages/Users"
import Admin from "./pages/Admin"

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
      path: '/admin',
      element: <Admin />
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
