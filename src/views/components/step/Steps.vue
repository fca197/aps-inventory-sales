<template>

  <div v-if="experienceData.length" style="width: 100%;margin-top: -80px">
    <div style="width: 100%; display: flex; position: relative; margin-top: 20px">
      <div style="width: 10%; margin-left: 30px;position: relative;left: 10px;">
        <div>
          <!-- 开头 -->
          <span data-v-jzl20210826="" style="margin-top: 49.5px" class="headerRadio"></span>
          <div v-if="experienceData.length > Index"><span v-for="(num, index) in leftRows" :key="index" class="hingelisHeard" style="margin-top: 98.9px"></span></div>
          <span data-v-jzl20210826="" v-if="leftShow" style="margin-top: 98.5px" class="hingeorgerHeard"></span>
        </div>
      </div>
      <div style="width: 100%">
        <div style="display: flex" v-for="(item, index) in experienceData" :key="index">
          <div class="timeline" v-for="(v, i) in DisplayProcessing(experienceData, index + 1)" :key="i">
            <div class="border"></div>
            <div v-if="v.actualMakeBeginTime" class="Nodes"></div>
            <div v-else class="Nodes_undone"></div>
            <div class="timeNodes">
              <div class="nodeTimes"></div>
              <div class="timeContent" v-if="v.actualMakeBeginTime">
                <span>{{ v.goodsStatusName }}</span>
                <br>
                <span>{{ v.actualMakeBeginTime }}</span>
              </div>
              <div class="timeContentCCC" v-else>
                <span>{{ v.goodsStatusName }}</span>
                <br>
                <span>{{ v.expectMakeBeginTime }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 10%; margin-right: 30px">
        <div>
          <!-- 第一行 -->
          <span class="hingelis" v-if="experienceData.length > Index"></span>
          <span data-v-jzl20210826="" v-if="experienceData.length <= Index" class="hingeorger"></span>
          <div v-if="experienceData.length > Index * 2"><span class="hingelis" v-for="(num, index) in rightRows" :key="index" style="margin-top: 100.3px"></span></div>
          <!-- 第二行 -->
          <span data-v-jzl20210826="" v-if="rightShow" style="margin-top: 100.3px" class="hingeorger"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['okRouteList', 'Index'],
  data() {
    return {
      experienceData: [],
      leftRows: 0,
      rightRows: 0,
      leftShow: false,
      rightShow: false
    }
  },

  created() {
  },
  watch: {
    okRouteList: {
      handler(newName, oldName) {
        this.handlerData(newName)
      },
      immediate: true
    }
  },
  methods: {
    handlerData(val) {
      this.experienceData = val
      let rows = Math.ceil(this.experienceData.length / this.Index)
      this.leftRows = rows == 2 ? 0 : rows % 2 == 0 ? parseInt(rows / 2) - 1 : parseInt(rows / 2)
      this.rightRows =
          rows == 4
              ? 1
              : rows % 2 == 0
                  ? parseInt(rows / 2) % 2 == 0
                      ? parseInt(rows / 2) >= 4
                          ? parseInt(rows / 2) - 1
                          : parseInt(rows / 2)
                      : parseInt(rows / 2) - 1
                  : parseInt(rows / 2) - 1
      this.leftShow = rows % 2 == 0 ? true : false
      this.rightShow = rows == 1 ? false : rows % 2 == 1 ? true : false
    },
    DisplayProcessing(Arg, Num) {
      //数据循环处理
      let arr = Arg.slice(this.Index * (Num - 1), this.Index * Num)
      arr = Num % 2 == 0 ? arr.reverse() : arr
      return arr
    },
    onClickDate(data) {
      //选择报告
      this.$emit('onClickDate', data)
    }
  }
}
</script>
<style scoped>
.timeline {
  width: 100%;
  height: 100px;
  position: relative;
}


.border {
  width: 100%;
  border-bottom: 1px solid #409eff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}


.border_undone {
  width: 100%;
  border-bottom: 1px solid #999;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.Nodes {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  border: 5px solid #1e9bff;
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(0, -50%);
}

.Nodes_undone {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  border: 5px solid #ddd;
  position: absolute;
  right: 50%;
  top: 50%;
  transform: translate(0, -50%);
}

.timeNodes {
  position: absolute;
  text-align: center;
  left: 50%;
  width: 200px;
  margin-left: -60px;
  top: 60%;
  transform: translate(0, -50%);
}

.timeContent {
  height: 40px;
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  margin-top: 30px;
  cursor: pointer;
}

.timeContentCCC {
  height: 40px;
  color: #aaa;
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  margin-top: 30px;
  cursor: pointer;
  margin-left: -90px;
}

.nodeTimelis {
  width: 70px;
  /* margin-bottom: 20px; */
  margin-left: 20px;
  overflow: hidden;
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.nodeTimelis:active {
  color: #1e9bff;
}

.nodeTimes {
  margin-bottom: 0;
}

.btns-img {
  height: 16px;
  width: 16px;
}

.hingelis {
  content: '';
  display: block;
  width: 100%;
  height: 100.1px;
  border: 1px solid #409eff;
  border-radius: 0 50px 50px 0;
  border-left: 0px;
  margin-top: 49.5px;
}

.hingelisHeard {
  content: '';
  display: block;
  width: 100%;
  height: 101.1px;
  border: 1px solid #409eff;
  border-radius: 50px 0 0 50px;
  border-right: 0px;
  margin-top: 50px;
}

.hingeorger {
  display: block;
  width: 100%;
  border-bottom: 1px solid #409eff;
  margin: 49.5px 0;
  position: relative;
}

.hingeorgerHeard {
  display: block;
  width: 100%;
  border-bottom: 1px solid #409eff;
  position: relative;
}

.hingeorgerHeard[data-v-jzl20210826]:after {
  content: '';
  position: absolute;
  top: -4px;
  left: -2px;
  border-top: 5px solid transparent;
  border-right: 12px solid #409eff;
  border-bottom: 5px solid transparent;
}

.hingeorger[data-v-jzl20210826]:after {
  content: '';
  position: absolute;
  top: -4px;
  right: -2px;
  border-top: 5px solid transparent;
  border-left: 12px solid #409eff;
  border-bottom: 5px solid transparent;
}

.headerRadio {
  display: block;
  width: 100%;
  border-bottom: 1px solid #409eff;
  position: relative;
}

.headerRadio[data-v-jzl20210826]:after {
  content: '';
  position: absolute;
  top: -4px;
  left: -2px;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  background: #409eff;
  border: 5px solid #409eff;
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translate(0, -50%);
}

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #99a9bf;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: #d3dce6;
}

</style>
