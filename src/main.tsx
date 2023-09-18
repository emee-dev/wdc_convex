import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "normalize.css";
import Router from "./Router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "./context/context";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const root = createRoot(document.getElementById("root")!);
root.render(
	<StrictMode>
		<AuthProvider>
			<ConvexProvider client={convex}>
				<BrowserRouter>
					<Router />
				</BrowserRouter>
			</ConvexProvider>
		</AuthProvider>
	</StrictMode>
);
