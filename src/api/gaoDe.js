import { log, post } from '@/api/common'

let gdKey = process.env['VUE_APP_GAODE_KEY']

export function addGdMap(elId) {
  let hm = document.createElement('script')
  hm.src = 'https://webapi.amap.com/maps?v=2.0&key=' + gdKey + '&output=json'
  let s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)

}

export function getLocationByLanLon(lat, lon, callBack) {
  //restapi.amap.com/v3/geocode/regeo?key=您的key&location=116.481488,39.990464&poitype=&radius=&extensions=base&roadlevel=1
  post('/gd/restapi/geocode/regeo/' + lon + '%2C' + lat,{},false).then(r => {
    let regeocode = r.regeocode
    log(lat, lon, regeocode)
    if (callBack) {
      callBack(regeocode)
    }
  })
}
