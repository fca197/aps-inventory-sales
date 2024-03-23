import request from "@/utils/request";

export function queryUnReadCount() {
  return request({
    url: "/msgMessage/unReadCount",
    method: "post",
    data: {}
  }).then((res) => parseInt(res.data.count));
}

export function msgMessageReadQueryPageList(data) {
  return request({
    url: "/msgMessage/queryPageList",
    method: "post",
    data: data
  }).then((res) => res.data);
}
