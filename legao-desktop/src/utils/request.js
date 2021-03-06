import axios from "axios";
// import { Message } from "element-ui";
import store from "@/store";

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
});

// 添加一个请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.cookie) {
      config.headers["userid"] = store.getters.cookie.userid;
      config.headers["token"] = store.getters.cookie.token;
    }
    if (!config.params) {
      config.params = {};
    }
    if (store.getters.userId) {
      config.params["aid"] = store.getters.userId;
    }
    if (store.getters.shopId) {
      config.params["shopid"] = store.getters.shopId;
    }
    return config;
  },
  error => {
    //请求出错
    console.log("发送错误", error);
    Promise.reject(error);
  }
);

// 添加一个响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.state == "error") {
      if (res.code == 1) {
        //token过期
        store.dispatch("LogOut").then(() => {
          location.reload();
        });
        return;
      } else {
        console.error(`${res.msg} - ${res.arg}`);
      }
      return Promise.reject();
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
