import axios from "axios";

const api = axios.create({
	baseURL: "https://pnpplxprssdata-production.up.railway.app",
	// baseURL: "http://localhost:3000",
	// Your backend URL
});

export default api;
