import axios from "axios";

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
  const onResponseSuccess = (response: any) => {
    console.log("response success", response);
    return response;
  };
  const onResponseFail = (error: {
    status: any;
    response: { status: any };
  }) => {
    console.log("response error", error);
    const status = error.status || error.response.status;
    if (status === 403 || status === 401) {
      console.log("logout");
    }
    return Promise.reject(error);
  };
  axios.interceptors.response.use(onResponseSuccess, onResponseFail);
  // axios.interceptors.request.use(function (config) {
  //   // const token = store.getState().session.token;
  //   config.headers.common["X-XSRF-Token"] =
  //     "CfDJ8P9KRILTMzhAnhVy-frmgBL3EG_tHbNj6oUsQ38zwL8t0tVWktgZ2KY_aDB0jq89eue547qKbuCwNYRFVvQRq-ZI_o0Dy12ikPQRrtedUrglrnOvO2y0oMCZMV_v-RoAblEUsVSFDRYfZwm-SBM5MrtVmx0kuHt6PP4LR3b9a8UwH1sRBrfpByRL7RFDu6j3kg";

  //   return config;
  // });
  // axios.defaults.headers.common["X-XSRF-Token"] =
  // j6oUsQ38zwL8t0tVWktgZ2KY_aDB0jq89eue547qKbuCwNYRFVvQRq-ZI_o0Dy12ikPQRrtedUrglrnOvO2y0oMCZMV_v-RoAblEUsVSFDRYfZwm-SBM5MrtVmx0kuHt6PP4LR3b9a8UwH1sRBrfpByRL7RFDu6j3kg";
};
export default setupAxiosInterceptors;
