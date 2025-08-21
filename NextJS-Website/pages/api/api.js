import axios from "axios";
// import config from "../../config.json";

// Fetch the API base URL from the environment variables
const apiKey =   process.env.NEXT_PUBLIC_API_KEY


const api = axios.create({
  baseURL: apiKey,
});

export default api;
