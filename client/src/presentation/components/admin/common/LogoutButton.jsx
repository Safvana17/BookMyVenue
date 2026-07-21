import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/redux/slices/authSlice";


const LogoutButton = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogout = async () => {

        await dispatch(logoutUser());

        navigate("/login");

    };


    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};


export default LogoutButton;