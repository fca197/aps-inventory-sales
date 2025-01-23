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
  post('/gd/restapi/geocode/regeo/' + lon + '%2C' + lat, {}, false).then(r => {
    let regeocode = r.regeocode
    log(lat, lon, regeocode)
    if (callBack) {
      callBack(regeocode)
    }
  })
}

export function initGdMap(_t,gdMapId ,func) {
  _t.$nextTick(() => {
    // 子组件加载成功后执行的代码
    // console.log('Child component has been mounted');
    log(document.getElementById(gdMapId))
    _t.gdMap = new AMap.Map('sellerStoreAddrInputDiv', {
      resizeEnable: true,
      center: [116.30946, 39.937629],
      zoom: 13
    })

    AMap.plugin(['AMap.PlaceSearch', 'AMap.DistrictSearch'], function() {
      _t.districtSearch = new AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        level: 'city',
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 1
      })
      _t.placeSearch = new AMap.PlaceSearch({
        map: _t.gdMap
      })  //构造地点查询类
      _t.placeSearch.on('markerClick', markerClick)//注册监听，当选中某条记录时会触发
      _t.gdMap.on('click', function(e) {
        if (_t.mapMark) {
          _t.mapMark.setMap(null)
          _t.mapMark = null
        }
        log(e)
        // _t.form.sellerStoreAddr=e.lnglat.address
        _t.form.sellerStoreGdLon = e.lnglat.lng
        _t.form.sellerStoreGdLat = e.lnglat.lat

        _t.mapMark = new AMap.Marker({
          icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
          position: [e.lnglat.lng, e.lnglat.lat],
          offset: new AMap.Pixel(-13, -30)
        })
        _t.mapMark.setMap(_t.gdMap)
        getLocationByLanLon(e.lnglat.lat, e.lnglat.lng, (r) => {
          _t.form.sellerStoreAreaCode = r.addressComponent.adcode
          _t.form.sellerStoreAddr = r.formatted_address.replace(
            r.addressComponent.province, '').replace(
            r.addressComponent.district, '')
        })
      })

      function markerClick(params) {
        log(params)
        _t.form.sellerStoreAddr = '(' + params.data.adname + ')'
          + params.data.address
        _t.form.sellerStoreGdLon = params.data.location.lng
        _t.form.sellerStoreGdLat = params.data.location.lat
        _t.form.sellerStoreAreaCode = params.data.adcode
        log(_t.form)
        if (_t.mapMark) {
          _t.mapMark.setMap(null)
          _t.mapMark = null
        }
      }
      if (func){
        func()
      }
    })
  })

}
