import request from "@/utils/request";

export function getSectionList(data) {
  return request({
    url: "/workshopSection/queryPageList",
    method: "post",
    data
  });
}
