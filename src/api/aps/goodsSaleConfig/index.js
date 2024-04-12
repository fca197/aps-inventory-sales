import request from "@/utils/request";

export function updateSaleConfig(data) {
  return request({
    url: "/apsGoodsSaleItem/updateSaleConfig",
    method: "post",
    data
  });
}

export function updateForecast(data) {
  return request({
    url: "/apsGoodsSaleItem/updateForecast",
    method: "post",
    data
  });
}

