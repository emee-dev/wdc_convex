import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	let data = null;
	if (!data) return <>This is the error</>;
	return <Outlet />;
};

export default ProtectedRoute;
