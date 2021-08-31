import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

instance.defaults.headers.common["Access-Token"] =
  process.env.REACT_APP_ETHERSCAN_TOKEN;
instance.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";

export default instance;
