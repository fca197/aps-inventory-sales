import request from "@/utils/request";

export  function getRandomUser() {
  return request({
    url: "/random/getRandomUser",
    method: "post",
  });
}
