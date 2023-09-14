import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NoAuth from "../pages/NoAuth";
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

	let { user } = useAuth();

	if (!user) return <NoAuth />;
	return <Outlet />;
};

export default ProtectedRoute;
