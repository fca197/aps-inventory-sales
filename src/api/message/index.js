import request from "@/utils/request";
import {Message} from "element-ui";

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

export function messageMaskRead() {
  return request({
    url: "/msgMessageRead/maskRead",
    method: "post",
    data: {}
  }).then((res) => Message.success("标记成功"));
}
