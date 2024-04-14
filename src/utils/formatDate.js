//方法一
export function formatDate(val) {
  var date = new Date(Number(val)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = date.getDate() + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = (date.getSeconds() < 10 ? "0" + (date.getSeconds())
      : date.getSeconds());
  return Y + M + D + h + m + s;
}

//方法二
export function formatDates(date, b) {
  var s = date.getFullYear() + '-' + padLeftZero(date.getMonth() + 1) + '-'
      + padLeftZero(date.getDate()) + ' ' + padLeftZero(date.getHours()) + ':'
      + padLeftZero(date.getMinutes()) + ':' + padLeftZero(date.getSeconds());
  return (b === true) ? s.replaceAll("-", "").replaceAll(" ", "").replaceAll(
      ":", "") : s;
}

export function formatDateNo(date) {
  var s = date.getFullYear() + '' + padLeftZero(date.getMonth() + 1) + ''
      + padLeftZero(date.getDate()) + '' + padLeftZero(date.getHours()) + ''
      + padLeftZero(date.getMinutes()) + '' + padLeftZero(date.getSeconds());
  return s;
}

export function padLeftZero(str) {
  return str <= 9 ? '0' + str : str;
}

