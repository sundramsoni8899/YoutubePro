import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000/api/v1",

    withCredentials: true,

    headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

apiClient.interceptors.request.use(
    (config)=>{
        if(config.data instanceof FormData){
            config.headers["Content-Type"]="multipart/form-data";
        }
        return config
    }, 
    (error)=>{
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response)=>{
        return response?.data;
    },
    async(error)=>{
        const originalRequest=config=error.config;

        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry= true;

            try{
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL || "http://localhost:7000/api/v1"}`,
                    {},
                    {withCredentials: true}
                )

                return apiClient(originalRequest)
            } catch(refreshError){
                console.error("🚨 [CRITICAL NETWORK HANDSHAKE DISASTER]: Silent re-auth token rotation failed.", refreshError);
                
                
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error?.response?.data || error);
    }
)

export default apiClient