import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login/customize";

export default function Loggedin() {
    const user = useSelector((users) => users.loggedinSlice.login);
    return user ? <Outlet/> : <Login/>;
}