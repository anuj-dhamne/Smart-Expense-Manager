import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from "./App.jsx"
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
        element: <Home />
      },
      {
        path: "add-expenses",
        element: <AddExpenses />
      },
      {
        path: "view-expenses",
        element: <ViewExpenses />
      },
      {
        path: "trends",
        element: <Trends />
      },
      {
        path: "profile",
        element: <ProfilePage/>
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
  <RouterProvider router={router}>
    <Header />
  </RouterProvider>

)
