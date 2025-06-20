import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import {
  Header,
  AddExpenses,
  ViewExpenses,
  Trends,
  Home,
  Profile,
  Test,
  LoginPage,
  RegisterPage,
  ProfilePage
} from './components/index.js'

// TODO: complete router 
const router = createBrowserRouter([
  {
    path: "/",
    element: "",
    children: [
      {
        path: "",
        element: <ProtectedRoute><Home/></ProtectedRoute>
      },
      {
        path: "add-expenses",
        element: <ProtectedRoute><AddExpenses /></ProtectedRoute>
      },
      {
        path: "view-expenses",
        element: <ProtectedRoute><ViewExpenses /></ProtectedRoute>
      },
      {
        path: "trends",
        element: <ProtectedRoute><Trends /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage/></ProtectedRoute>
      },
      {
        path: "under-test",
        element: <Test />
      },
      {
        path: "login",
        element: <LoginPage/>
      },
      {
        path: "register",
        element: <RegisterPage/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <RouterProvider router={router}>
    <Header />
  </RouterProvider>
</AuthProvider>
)
