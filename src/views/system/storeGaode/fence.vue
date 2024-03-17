<template>

  <div>
    <div id="container" :style="styObj"></div>
    <div id="">
      <div class="m-4">
        <p> 功能点：</p>

          <el-button type="info" icon="el-icon-circle-plus-outline" @click="drawRectangle">绘制围栏</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="editRectangle">编辑围栏</el-button>
          <el-button type="warning" icon="el-icon-delete" @click="cancelRectangle">取消编辑</el-button>
          <el-button type="success" icon="el-icon-success" @click="saveRectangle">保存围栏</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleRectangle">删除围栏</el-button>

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
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'index',
  data() {
    return {
      mouseTool: undefined,
      //https://blog.csdn.net/allenlu2008/article/details/103029132
      h3Res: 9, //  9 =174米， 8=461米 ，
      polygon: null,
      districtList: [],
      map: null,
      styObj: {
        height: 0,
        float: 'left',
      },
      contextMenu: null,
      path: [],//以前绘制的数据
      paths: [], // 当前绘制的多边形经纬度数组
      polygonItem: [], // 地图上绘制的所有多边形对象
      polyEditors: [],// 新增数据=>所有编辑对象数组
      polyEditorsBefore: [],// 以前历史数据=>进入编辑对象数组
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
      "version": "2.0",   // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
      "plugins": ['AMap.Scale','AMap.ContextMenu', 'AMap.PolyEditor','AMap.Scale', 'AMap.ToolBar', 'AMap.MouseTool', 'AMap.Driving', 'AMap.DistrictSearch', 'AMap.MarkerClusterer', 'AMap.InfoWindow'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'
    }).then((AMap) => {
      // 添加工具栏

      _this = this;
      this.map = new AMap.Map('container', {zoom: 10});
      // this.map.addControl(new AMap.MouseTool())
      // this.map.addControl( new AMap.ToolBar())
      // this.map.addControl(new AMap.Scale())
      // this.map.addControl(new AMap.RangingTool())
      // this.map.plugin([ 'AMap.RangingTool','AMap.ToolBar', 'AMap.Scale'], () => {
      //
      // }) ;
      //为地图注册click事件获取鼠标点击出的经纬度坐标
      this.map.on('click', function (e) {
        console.info(e.lnglat.getLng() + ',' + e.lnglat.getLat())
      });
    }).catch(e => {
      console.log(e);
    })
  },
  mounted() {
    window.addEventListener('resize', this.changeHeight);
    this.changeHeight();
  },
  methods: {
    changeHeight() {
      this.styObj.height = window.innerHeight - 90 + 'px';
    },

    // 绘制多边形
    drawRectangle() {
      const This = this;
      let mouseTool = new AMap.MouseTool(this.map);
      const polygon = mouseTool.polygon({
        //polygon：绘制多边形【线段：polyline;矩形：rectangle;圆：circle】
        strokeColor: 'red',
        strokeOpacity: 0.4,
        strokeWeight: 6,
        fillColor: '#1791fc',
        fillOpacity: 0.2,
        // strokeStyle还支持 solid
        strokeStyle: 'solid',
        // strokeDasharray: [30,10],
      });
      mouseTool.on('draw', function (event) {
        // event.obj 为绘制出来的覆盖物对象
        let polygonItem = event.obj;
        let paths = polygonItem.getPath();//取得绘制的多边形的每一个点坐标
        // console.log('覆盖物对象绘制完成各个点的坐标', paths, event);

        let path = [];  // 编辑的路径
        paths.forEach(v => {
          path.push([v.lng, v.lat])
        });
        This.paths = path //将新增数据放入paths数组里
        // This.editRectangle();//绘制完成,默认进入编辑状态
        This.polygonItem.push(event.obj);
        // This.map.remove(event.obj); // 删除多边形
        // console.log(polygon, '------polygon-----');
      });
    },
    // 编辑围栏
    editRectangle() {
      const path = this.paths;
      //新增的进入编辑状态
      let polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 1,
        strokeOpacity: 2,
        fillOpacity: 0.2,
        fillColor: '#1791fc',
        zIndex: 250,
      });
      this.map.add(polygon);
      this.polygonItem.push(polygon);
      // 缩放地图到合适的视野级别
      this.map.setFitView([polygon]);

      this.polyEditor = new AMap.PolyEditor(this.map, polygon);
      this.polyEditor.open();
      this.polyEditors.push(this.polyEditor);

      //历史围栏的进入编辑状态
      let polygonBefore = new AMap.Polygon({
        path: this.path,
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 2,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
      });
      this.map.add(polygonBefore);
      this.polygonItem.push(polygonBefore);
      // 缩放地图到合适的视野级别
      this.map.setFitView([polygonBefore]);

      this.polyEditorBefore = new AMap.PolyEditor(this.map, polygonBefore);
      this.polyEditorBefore.open();
      this.polyEditorsBefore.push(this.polyEditorBefore);

    },
    // 取消编辑状态
    cancelRectangle() {
      this.polyEditors.forEach(item => { item.close(); });//新增
      this.polyEditorsBefore.forEach(item => { item.close(); });//历史
    },
    //保存围栏
    saveRectangle() {
      // 取消编辑状态
      this.polyEditors.forEach(item => { item.close(); });
      this.polyEditorsBefore.forEach(item => { item.close(); });
     console.log(this.paths,this.path) //;;=>成功（重新刷新页面）
    //...
    },
    // 删除围栏
    deleRectangle() {
      this.polyEditors.forEach(item => { item.close(); });// 取消编辑状态
      this.polyEditorsBefore.forEach(item => { item.close(); });// 取消编辑状态
      this.map.clearMap(); // 删除地图所有覆盖物
      //删除=>成功（重新刷新页面）
    //...
    },
    //获取后台数据
    init() {
      const that = this
      let param = {
        carId: this.formData.carId,//string true carID
        pageNum: this.formData.pageNum,//string false 当前页数
        pageSize: this.formData.pageSize,//string false 每页条数
      }
      geofenceList({ param }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.list.length==0) {
            this.$message.error('没有围栏数据')
            return
          }
          that.path=[]
          that.map.clearMap(); // 删除地图所有覆盖物
          res.data.data.list.forEach((item, index) => { //同时展示多个围栏
            that.path.push(item.points)//编辑时，可以一起编辑
            // this.centerArr = that.path[0]
            // this.initMap()

            that.map.add(new AMap.Polygon({
              path: item.points,
              strokeColor: "#FF33FF",
              strokeOpacity: 1,
              strokeWeight: 2,
              strokeOpacity: 0.2,
              fillColor: '#1791fc',
              fillOpacity: 0.4,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
            }));
            that.map.setFitView();
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
  }
}
</script>
