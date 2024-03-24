import request from "@/utils/request";
import {Message} from "element-ui";

export function saveBuyPlan(data) {
  return request({
    url: "/jcxBuyPlan/insert",
    method: "post",
    data
  }).then(res => {
    Message.success("采购计划保存成功")
  });
}
