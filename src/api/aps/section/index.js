import request from "@/utils/request";

export  function getSectionList(data) {
  return request({
    url: "/section/list",
    method: "get",
    data
  });
}
