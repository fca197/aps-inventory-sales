import request from "@/utils/request";

const urlPrefix = "/factory"

export function brandList(data) {
  return request({
    url: urlPrefix + "/queryPageList",
    method: 'post',
    data
  })
}
