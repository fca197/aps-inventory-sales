import request from "@/utils/request";

export function apsGoodsSaleItemQueryPageList(data) {
  return request({
    url: "/apsGoodsSaleItem/queryPageList",
    method: "post",
    data
  });
}
