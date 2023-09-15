import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/context";

const ProtectedRoute = () => {
	// const getRoom = useQuery(api.db.getRoom, {
	// 	roomId: "12dscsc",
	// 	passPhrase: "stringified",
	// });

	// if (!getRoom || !getRoom.status) {
	// 	// setLoading(false);
	// 	// setBtnMsg("Error Joining room");
	// 	console.log(getRoom?.error);
	// 	console.log(getRoom?.dbErr);
	// 	return;
	// }

	const navigate = useNavigate();
	const handleNavigation = (path: string) => navigate({ pathname: path });

	let { user, setUser } = useAuth();
	let key = "user";
	let data = JSON.parse(localStorage.getItem(key)!);

	useEffect(() => {
		if (!user.roomId && !user.username && !data) {
			handleNavigation("/unauthorized");
		} else {
			setUser(data);
		}
	}, []);

	return <Outlet />;
};

export default ProtectedRoute;
