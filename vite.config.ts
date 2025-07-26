import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			// Proxy any request starting with /api to your backend server
			"/api": {
				target: "http://localhost:3000", // your backend server port

				rewrite: (path) => path.replace(/^\/api/, ""),
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
