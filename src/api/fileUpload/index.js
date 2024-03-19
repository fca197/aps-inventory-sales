import request from "@/utils/request";

export function getImageBase64(id) {
  if (id === undefined){
    return Promise.reject({ message: "id不能为空"})
  }
  return request({
    url: "fileUpload/getFileBase64",
    data: {
      id: id
    }
  }).then(res => {
    return  "data:image/png;base64,"+res.data.base64;
  })
}
