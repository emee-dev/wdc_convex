import { Route, Routes } from "react-router-dom";
import Video from "./components/VideoPlayer";
import CreateRoom from "./components/CreateRoom";
import "rsuite/dist/rsuite.min.css";

function Router() {
	return (
		<Routes>
			<Route path="/" element={<> Home Page</>} />
			<Route path="/create" element={<CreateRoom />} />
			<Route path="/play" element={<Video />} />
			{/* <Route path="/users/*" element={<UserApp />} /> */}
		</Routes>
	);
}

export default Router;
