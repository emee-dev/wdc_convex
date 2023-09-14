import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VideoPage from "./components/VideoPlayer";
import VideoLink from "./components/CreateRoom";
import NotFound from "./pages/NoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "rsuite/dist/rsuite.min.css";

function Router() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/create" element={<VideoLink />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/room" element={<VideoPage />} />
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Router;
