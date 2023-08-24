
import { createRouter } from "@remix-run/router";
import { useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Rootlayout from "./Layout";
import Forgot from "./pages/Forgotpassword";
import Home from "./pages/Home";
import Login from "./pages/Login/customize";
import Registration from "./pages/registration/script";
import Loggedin from "./PrivateRouter/Loggedinuser";
import Notloggedin from "./PrivateRouter/Notloggedin";
import MessageBox from "./pages/message";
import Notification from "./pages/Notification";

function App() {
const router = createBrowserRouter (createRoutesFromElements(
  <Route>
    <Route element={<Loggedin/>}>
      <Route element={<Rootlayout/>}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/MessageBox" element={<MessageBox />}></Route>
        <Route path="/Notification" element={<Notification />}></Route>
      </Route>
    </Route>
    <Route element={<Notloggedin/>}>
    <Route path="/registration" element={<Registration/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route path="/forgotpassword" element={<Forgot/>}></Route>
    </Route>

  </Route>
))
  return(
    <>
    <RouterProvider router={router}></RouterProvider>
    
    </>
  );
}

export default App;
