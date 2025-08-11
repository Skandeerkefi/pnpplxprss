import axios from "axios";

const api = axios.create({
	baseURL: "https://pnpplxprssdata-yj6v.onrender.com",
	// baseURL: "http://localhost:3000",
	// Your backend URL
});

export default api;
