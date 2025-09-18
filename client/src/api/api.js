import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send cookies
});

// Request interceptor to attach access token
API.interceptors.request.use(
  (config) => {
    const token = window.store?.getState().user.accessToken; // Redux access token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to auto-refresh token
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.get(
          `${API.defaults.baseURL}/auth/refresh-token`,
          { withCredentials: true }
        );
        // Update Redux store
        window.store.dispatch({
          type: "user/loginSuccess",
          payload: {
            user: window.store.getState().user.user,
            accessToken: data.accessToken,
            refreshToken: null,
          },
        });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        window.store.dispatch({ type: "user/logout" });
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default API;
