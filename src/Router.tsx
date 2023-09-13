import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import VideoPage from "./components/VideoPlayer";
import VideoLink from "./components/VideoLink";
import NotFoundTitle from "./assets/NoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "rsuite/dist/rsuite.min.css";

function Router() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/create" element={<VideoLink />} />
			{/* <Route path="/room" element={<VideoPage />} /> */}
			<Route element={<ProtectedRoute /* component={<>This is protected</>} */ />}>
				<Route path="/room" element={<VideoPage />} />
			</Route>
			<Route path="*" element={<NotFoundTitle />} />
		</Routes>
	);
}



export default Router;
