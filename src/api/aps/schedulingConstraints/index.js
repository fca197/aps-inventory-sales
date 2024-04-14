import request from "@/utils/request";

export function getSchedulingConstraintsList(data) {
  data.queryPage = false;
  return request({
    url: "/apsSchedulingConstraints/queryPageList",
    method: "post",
    data
  });
}
