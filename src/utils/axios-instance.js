import axios from "axios";

const makeAxiosInstance = () => {
  const instance = axios.create();

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status == "401") {
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = makeAxiosInstance();

export { axiosInstance };
