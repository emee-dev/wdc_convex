import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/context";

const ProtectedRoute = () => {
	const navigate = useNavigate();

	const { setUser } = useAuth();

	useEffect(() => {
		const key = "user";
		const data = JSON.parse(localStorage.getItem(key) || "null");

		if (!data) {
			// User not found in local storage, redirect to /unauthorized
			navigate("/unauthorized");
		} else {
			setUser(data);
		}
	}, [navigate]);

	return <Outlet />;
};

export default ProtectedRoute;
