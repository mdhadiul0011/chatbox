import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function Notloggedin() {
    const user = useSelector((users) => users.loggedinSlice.login);
    return user ? <Navigate to='/'/> : <Outlet/>;
}