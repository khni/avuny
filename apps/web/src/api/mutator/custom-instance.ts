// custom-instance.ts

import Axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASEURL;
if (!baseURL) {
  throw new Error(
    "BASEURL is not defined in .env file. It should be defined as NEXT_PUBLIC_BASEURL"
  );
}

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL,
  withCredentials: true, // so cookies (refresh token) are included
});

// Request interceptor: add token
AXIOS_INSTANCE.interceptors.request.use((config: any) => {
  // If Authorization header already exists and starts with 'Bearer', skip attaching anything
  const hasBearerAlready =
    typeof config.headers?.Authorization === "string" &&
    config.headers.Authorization.trim().toLowerCase().startsWith("bearer");

  if (!hasBearerAlready) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});

// Response interceptor: refresh logic
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401) {
      // const errData = error.response.data as ErrorResponse<AuthErrorCodesType>;
      const errData: any = error.response.data;
      // 🔹 Case 1: Wrong login credentials — do not refresh
      // if (errData?.code === "INCORRECT_CREDENTIALS") {
      //   return Promise.reject(error);
      // }

      // 🔹 Case 2: Token expired or invalid — try refresh
      if (
        errData.errorType === "Server" &&
        (errData?.error.code === "INVALID_ACCESS_TOKEN" ||
          errData?.error.code === "EXPIRED_ACCESS_TOKEN" ||
          errData?.error.code === "MISSING_ACCESS_TOKEN") &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          // queue failed requests until refresh finishes
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                };
                resolve(AXIOS_INSTANCE(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // call refresh token API
          const { data } = await Axios.post(
            `${baseURL}/token/refresh`,
            {},
            { withCredentials: true }
          );

          const newToken = data.accessToken;
          localStorage.setItem("accessToken", newToken);

          AXIOS_INSTANCE.defaults.headers.common["Authorization"] =
            `Bearer ${newToken}`;

          processQueue(null, newToken);

          return AXIOS_INSTANCE(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          // 🔹 Optionally redirect to login here
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

// Your custom wrapper
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

// const customInstance = axios.create({
//   baseURL: process.env.DOMAIN,
//   withCredentials: true,
//   timeout: 10000, //it will be changed later to 5000, but I changed to 5000 because Iam using slow db service
// });

// // Add a request interceptor to inject the locale into headers
// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const locale = getLocaleFromCookies();

//     if (config.headers) {
//       (config.headers as AxiosHeaders).set("Accept-Language", locale);
//     } else {
//       config.headers = new AxiosHeaders({ "Accept-Language": locale });
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default customInstance;
