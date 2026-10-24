import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        
        return response?.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // CRITICAL LOOP FIX: Agar request pehle se hi current-user ya refresh-token ki hai, 
        // to use silent rotation me mat daalo, seedhe error catch block me bhejo.
        if (
            originalRequest.url.includes("/users/current-user") || 
            originalRequest.url.includes("/users/refresh-token")
        ) {
            return Promise.reject(error?.response?.data || error);
        }

        // Agar backend 401 (Unauthorized) return karta hai aur abhi tak retry nahi kiya hai
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000/api/v1";
                
                //  ENDPOINT FIX: Base URL ke aage sahi endpoint lagaya (/users/refresh-token)
                await axios.post(
                    `${baseURL}/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // Token refresh hone ke baad original API ko fir se hit karein
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error(" [CRITICAL NETWORK HANDSHAKE DISASTER]: Silent re-auth token rotation failed.", refreshError);
                
                // Agar refresh token bhi expire ho chuka hai, tabhi login par bhejein
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error?.response?.data || error);
    }
);

export default apiClient;
