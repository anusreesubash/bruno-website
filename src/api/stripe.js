import { axiosInstance } from "src/utils/axios-instance";

const paymentSuccess = ({ sessionId, orderNumber }) => {
  return new Promise(async (resolve, reject) => {
    axiosInstance
      .post(`/api/stripe/success`, {sessionId, orderNumber})
      .then((res) => res)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export { paymentSuccess };