<template>
  <div class="app-container home">
    <el-row :gutter="20">

    </el-row>
    <el-row :gutter="20">
      <el-col :lg="24" :sm="24" style="padding-left: 20px">
        <div id="mainDiv" style="width: 100%;height: 400px;"></div>

      </el-col>

    </el-row>
    <el-divider/>
    <el-row :gutter="20">

      <el-timeline>
        <el-timeline-item v-for="item in projectTimeLineList" :key="item.time" :color="item.color"
                          :timestamp="item.time" placement="top">
          <el-card>
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </el-row>
  </div>
</template>

<script>
import ECharts from 'events'
import * as echarts from "echarts";

export default {
  name: "Index",
  components: {
    ECharts
  },
  data() {
    return {

      projectTimeLineList: [
        {time: '2024-03-17 19:01', title: "项目初始化", content: "整合从上班到目前现有项目经验"},
        {time: '2024-03-17 22:50', title: "资产盘点项目", content: "包含工厂, 楼层,房间, 资产录入管理, 资产扫码盘点"},
        {time: '2024-03-19 18:00', title: "进存销项目", content: "包含商品管理, 订单生成, 商品盘点,采购计划,采购单 等功能"},
        {time: '2024-03-29 13:00', title: "APS", content: "包含商品,销售配置,预测,工厂配置,工艺流程等功能", color: "#409EFF"},
      ].reverse(),
      // 版本号
      version: "3.8.6"
    };
  },
  mounted() {
    let c = document.getElementById('mainDiv');
    // console.log(c);
    let myChart = echarts.init(c)
    // 绘制图表
    myChart.setOption({
      title: {text: '生产数量'},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'  // 阴影模式
        }
      },

      legend: {
        data: ['产能', '限制']
      },
      xAxis: {
        data: ["2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07", "2024-01-08"]
      },
      yAxis: {},
      series: [{
        name: '产能',
        type: 'line',
        data: [15, 20, 37, 15, 8, 23]
      },{
        name: '限制',
        type: 'line',
        data: [13, 23, 27, 45, 18, 43]
      }]
    });

  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

