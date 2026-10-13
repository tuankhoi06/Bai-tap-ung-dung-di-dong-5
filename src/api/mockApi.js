import axios from "axios";

const api = axios.create({
  baseURL: "https://6ace11a6f338359cf1c30574.mockapi.io/ccjdo",
  timeout: 5000,
});

export default api;