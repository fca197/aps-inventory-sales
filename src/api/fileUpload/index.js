import request from "@/utils/request";

export function getImageBase64(id) {
  return getFileBase64(id).then(res => {
    return "data:image/png;base64," + res;
  })
}

export function getFileBase64(id) {
  if (id === undefined) {
    return Promise.all({data: {base64: ""}})
  }
  return request({
    url: "fileUpload/getFileBase64",
    data: {
      id: id
    }
  }).then(res => {
    return res.data.base64;
  })
}
