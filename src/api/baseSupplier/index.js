import request from "@/utils/request";

export function querySupplierPageList(data) {
  // console.log(data)
  return request({
    url: "/baseSupplier/queryPageList",
    method: "post",
    data
  });
}
