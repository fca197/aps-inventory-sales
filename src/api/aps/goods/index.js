import request from "@/utils/request";

export function getGoodsList(data) {
  data.queryPage = false;
  return request({
    url: "/apsGoods/queryPageList",
    method: "post",
    data
  });
}
