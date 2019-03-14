import qs from "qs";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
export default function fetch({
  method = "get",
  url,
  data,
  params,
  isJSON = false
}) {
  NProgress.start();
  let option = {
    method,
    url,
    data: isJSON ? data : qs.stringify(data),
    params
  };
  //if (url != "/api/login") option.headers = { Authorization: this.state.token };
  return axios(option)
    .then(function({data}) {
      NProgress.done();
      if (
        typeof data.success !== "undefined" &&
        typeof data.msg !== "undefined"
      ) {
        throw {
          message: data.msg
        };
      } else {
        return data;
      }
    })
    .catch(e => {
      NProgress.done();
      throw e;
    });
}
