import request from "@/utils/request";

export function getRoomList(data) {
  return request({
    url: "/apsRoom/queryList",
    method: "post",
    data
  });
}
