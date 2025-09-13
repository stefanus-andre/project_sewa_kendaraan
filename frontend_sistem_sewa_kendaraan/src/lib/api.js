import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      forceLogout();
    }
    return Promise.reject(error);
  }
);


export const logout = async () => {
  try {
   
    await api.post("/logout");
  } catch (error) {
    console.log("Logout API error:", error);
  } finally {
    forceLogout();
  }
};

export const forceLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("auth");
  

  if (typeof window !== 'undefined') {

    window.location.replace('/');
    

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
};


export default api;
