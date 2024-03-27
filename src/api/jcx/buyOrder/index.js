import request from "@/utils/request";
import {Message} from "element-ui";

export function savePlanOrder(data) {
  return request({
    url: "/jcxBuyOrder/insert",
    method: 'post',
    data
  }).then(res => {
    Message.success("采购订单保存成功")
  })
}
