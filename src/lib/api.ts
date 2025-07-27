import axios from "axios";

const api = axios.create({
	baseURL: "https://pnpplxprssdata.onrender.com", // Your backend URL
});

export default api;
