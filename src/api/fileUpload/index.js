import request from "@/utils/request";

export function getImageBase64(id) {
  return getFileBase64(id).then(res => {
    try {
      return res.length > 0 ? "data:image/png;base64," + res : "";
    } catch (e) {
      return "";
    }
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
    try {
      return res.data.base64;
    } catch (e) {
      return "";
    }
  })
}
