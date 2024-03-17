<template>

  <div>
    <div id="container" :style="styObj"></div>
    <div id="proDiv">
      <h3>查询门店</h3>
      <div class="m-4">
        <p>省：</p>
        <el-select  filterable id='province' v-model="provinceCode" class="m-2" @change="loadCityAreaList()">
          <el-option v-for="(p, index) in provinceList" :key="p.adCode" :label="p.name" :value="p.adCode"> {{ p.name }}
          </el-option>
        </el-select>
      </div>
      <div class="m-4">
        <p> 市：</p>
        <el-select  filterable id='city' v-model="cityCode" class="m-2" @change="showCitySize">
          <el-option v-for="(p, index) in cityList" :key="p.adCode" :label="p.name" :value="p.adCode"> {{ p.name }}
          </el-option>
        </el-select>
      </div>
      <div class="m-4">
        <p> 区：</p>
        <el-select  filterable id='area' v-model="areaCode" class="m-2" @change="showAreaSize">
          <el-option v-for="(p, index) in districtList" :key="p.adCode" :label="p.name" :value="p.adCode"> {{ p.name }}
          </el-option>
        </el-select>
      </div>

      <div class="m-4">
        <p> H3 层级：</p>
        <el-select  filterable id='h3Res' v-model="h3Res" class="">
          <el-option v-for="(p, index) in 13" :key="p" :label="p-1" :value="p-1"> {{ p - 1 }}
          </el-option>
        </el-select>
        <p> 功能点：</p>
        <el-button v-on:click="drawH3Click">绘制H3 {{ drawH3 }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select_btn {
  position: absolute;
  top: 5px;
  right: 60px;

.el-select-dropdown {
  border: none;
  background-color: rgba(1, 28, 82, 0.8);
}

.el-input__inner {
  color: #eee;
  border-color: #00fff6;
  background-color: rgba(1, 28, 82, 0.8);
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: #0B61AA;
  background-color: rgba(1, 28, 82, 0.8);
  color: #00D3E9;
}

.el-select-dropdown__item {
  color: #eee;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  color: #00D3E9;
  background-color: #0F3360;
}

}

#proDiv {
  padding-left: 20px;
  float: left;
}

#container {
  width: 1000px;
  height: 100px;
}
</style>
<script>
import {selectList} from "@/api/store";
import AMapLoader from '@amap/amap-jsapi-loader';
import {areaList} from "@/api/area";
import {latLngCellToBoundary} from "@/api/h3code";

export default {
  name: 'index',
  data() {
    return {
      mouseTool: undefined,
      drawH3: true,
      //https://blog.csdn.net/allenlu2008/article/details/103029132
      h3Res: 9, //  9 =174米， 8=461米 ，
      polygon: null,
      areaCode: null,
      areaCodeName: null,
      cityCode: null,
      cityCodeName: {},
      provinceCode: null,
      provinceList: [],
      cityList: [{
        name: 'cx',
        adCode: "xx"
      }],
      districtList: [],
      map: null,
      styObj: {
        height: 0,
        float: 'left',
      }
    };
  },
  created() {
    let _this = this;
    //配置安全密钥
    window._AMapSecurityConfig = {
      // securityJsCode: process.env.VUE_APP_GAODE_KEY_SECRET //*  安全密钥
      securityJsCode: '925aaf03f4c8939d8d57c763d4a5e804' //*  安全密钥
    }
    AMapLoader.load({
      // "key": process.env.VUE_APP_GAODE_KEY,              // 申请好的Web端开发者Key，首次调用 load 时必填
      "key": '524d016884fc1e717a7083da9fc88961',              // 申请好的Web端开发者Key，首次调用 load 时必填
      // "version": "2.0",   // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      "plugins": ['AMap.Scale',  'AMap.Scale','AMap.ToolBar','AMap.MouseTool', 'AMap.Driving', 'AMap.DistrictSearch', 'AMap.MarkerClusterer', 'AMap.InfoWindow'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'
    }).then((AMap) => {

      this.map = new AMap.Map('container', {zoom: 10});
      _this = this;
      //为地图注册click事件获取鼠标点击出的经纬度坐标
      this.map.on('click', function (e) {
        console.info(e.lnglat.getLng() + ',' + e.lnglat.getLat())
        _this.drawH3Function(e)
      });
      this.loadStoreList({})
    }).catch(e => {
      console.log(e);
    })
  },
  mounted() {
    window.addEventListener('resize', this.changeHeight);
    this.changeHeight();
    this.loadAreaList({level: 1});
  },
  methods: {
    drawPolygon(){
      if (this.mouseTool===undefined){
        this.mouseTool = new AMap.MouseTool(this.map);

        let _this = this;
        this.mouseTool.polygon({
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 2,
          strokeOpacity: 0.2,
          fillColor: '#1791fc',
          fillOpacity: 0.4,
          // 线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          // strokeDasharray: [30,10],
        })
        this. mouseTool.on('draw', function(e) {
          // event.obj 为绘制出来的覆盖物对象
          console.info('覆盖物对象绘制完成',e.obj)
          _this. mouseTool.close(false);
          console.log(e.obj.getPath()); //获取路径/范围

        })
      }
    },
    drawH3Function(e) {
      if (!this.drawH3) {
        console.info("drawH3:"+this.drawH3+" break")
       this. drawPolygon();
        return;
      }
      let latLngCellToBoundaryList = latLngCellToBoundary({
        "lat": e.lnglat.getLat(),
        "lng": e.lnglat.getLng(),
        "res": this.h3Res
      });
      latLngCellToBoundaryList.then(r => {
        let dataList = r.data.dataList;
        let dddd = [];
        dataList.forEach(t => {
          dddd.push(new AMap.LngLat(t.lng, t.lat));
        });
        let polygon = new AMap.Polygon({
          path: dddd,
          fillColor: '#ccebc5',
          strokeOpacity: 1,
          fillOpacity: 0.5,
          strokeColor: '#2b8cbe',
          strokeWeight: 1,
          strokeStyle: 'dashed',
          strokeDasharray: [5, 5],
        });
        polygon.on("click", () => {
          this.map.remove(polygon)//清除上次结
        });
        polygon.on('mouseover', () => {
          polygon.setOptions({
            fillOpacity: 0.7,
            fillColor: '#7bccc4'
          })
        })
        polygon.on('mouseout', () => {
          polygon.setOptions({
            fillOpacity: 0.5,
            fillColor: '#ccebc5'

          })
        })
        this.map.add(polygon);
      })
    },
    drawH3Click() {
      this.drawH3 = !this.drawH3;
    },
    showAreaSize() {
      this.showSize('district', this.areaCodeName[this.areaCode]);
    },

    showSize(level, areaName) {
      const _this = this;
      console.log(level, areaName)
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 0,   //获取边界不需要返回下级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: level, // 关键字对应的行政区级别，country表示国家
      });

      // 搜索所有省/直辖市信息
      districtSearch.search(areaName, function (status, result) {
        if (_this.polygon) {
          _this.map.remove(_this.polygon)//清除上次结果
          _this.polygon = null;
        }
        if (!result.districtList) {
          return
        }
        const bounds = result.districtList[0].boundaries;
        if (bounds) {
          //生成行政区划polygon
          for (let i = 0; i < bounds.length; i += 1) {//构造MultiPolygon的path
            bounds[i] = [bounds[i]]
          }
          _this.polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: bounds,
            fillOpacity: 0.4,
            fillColor: '#80d8ff',
            strokeColor: '#0091ea'
          });
          _this.map.add(_this.polygon)
          _this.map.setFitView(_this.polygon);//视口自适应
        }
      })

    },

    showCitySize() {
      this.showSize('city', this.cityCodeName[this.cityCode]);
      this.loadAreaList({level: 3, parentCode: this.cityCode});

    },
    loadCityAreaList() {
      this.loadAreaList({level: 2, parentCode: this.provinceCode});
    },
    loadAreaList(data) {
      if (1 === data.level) {
        this.cityCodeName = {};
        this.cityList = []
        this.cityCode = '';
        this.areaCodeName = {};
        this.districtList = []
        this.areaCode = ''
      } else if (2 === data.level) {
        this.cityCodeName = {};
        this.cityList = []
        this.cityCode = '';
        this.areaCodeName = {};
        this.districtList = []
        this.areaCode = ''
      } else if (3 === data.level) {
        this.areaCodeName = {};
        this.districtList = []
        this.areaCode = ''
      }
      areaList(data).then(res => {
        let dataList = res.data.dataList;
        dataList.forEach(r => {
          if (1 === data.level) {
            this.provinceList.push(r)
          } else if (2 === data.level) {
            this.cityList.push(r)
            this.cityCodeName[r.adCode] = r.name
          } else if (3 === data.level) {
            this.districtList.push(r);
            this.areaCodeName[r.adCode] = r.name
          }
        })
      })
    },
    changeHeight() {
      this.styObj.height = window.innerHeight - 90 + 'px';
    },
    _renderClusterMarker(context) {
      const factor = Math.pow(context.count / this.count, 1 / 18);
      const div = document.createElement('div');
      const Hue = 180 - factor * 180;
      const bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
      const fontColor = 'hsla(' + Hue + ',100%,20%,1)';
      const borderColor = 'hsla(' + Hue + ',100%,40%,1)';
      const shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
      div.style.backgroundColor = bgColor;
      const size = Math.round(30 + Math.pow(context.count / this.count, 1 / 5) * 20);
      div.style.width = div.style.height = size + 'px';
      div.style.border = 'solid 1px ' + borderColor;
      div.style.borderRadius = size / 2 + 'px';
      div.style.boxShadow = '0 0 1px ' + shadowColor;
      div.innerHTML = context.count;
      div.style.lineHeight = size + 'px';
      div.style.color = fontColor;
      div.style.fontSize = '14px';
      div.style.textAlign = 'center';
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div)
    },
    loadStoreList(data) {
      const markers = [];
      let _map = this.map;
      selectList(data).then(res => {
        let dataList = res.data.dataList;
        dataList.forEach(m => {
          let marker = new AMap.Marker({
            position: [m.lat, m.lon],
            label: {content: m.storeName, offset: new AMap.Pixel(20, 0)},
            extData: m,
            clickable: true
          });
          markers.push(marker);
        });
        markers.forEach(marker => {
          marker.setMap(this.map)
          AMap.event.addListener(marker, 'click', function (e) {
            var store = e.target.getExtData();
            console.log(store.id);
            //得到的数据
            new AMap.InfoWindow({
              content: store.storeName,
            }).open(_map, e.lnglat)
          });
        })

        this.count = markers.length
        if (this.cluster) {
          this.cluster.setMap(this.map)
        }
        this.cluster = new AMap.MarkerClusterer(this.map, markers, {
          gridSize: 30, renderClusterMarker: this._renderClusterMarker
        });
      })
    }
  }
}
</script>
