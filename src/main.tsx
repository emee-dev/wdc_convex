import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "normalize.css";
import Router from "./Router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth, AuthProvider } from "./context/context";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const root = createRoot(document.getElementById("root")!);
root.render(
	<StrictMode>
		<ConvexProvider client={convex}>
			<AuthProvider>
				<BrowserRouter>
					<Router />
				</BrowserRouter>
			</AuthProvider>
		</ConvexProvider>
	</StrictMode>
);
