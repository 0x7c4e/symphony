import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext.jsx";
// import { Toaster } from "./components/ui/sonner.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<>
		<SocketProvider>
			<App />
			<Toaster closeButton richColors position="top-right" />
		</SocketProvider>
	</>
);
