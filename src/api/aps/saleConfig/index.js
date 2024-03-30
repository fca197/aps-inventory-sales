import request from "@/utils/request";

export function getSaleConfigList(data) {
  data.queryPage = false;
  return request({
    url: "/apsSaleConfig/queryPageList",
    method: "post",
    data
  });
}
