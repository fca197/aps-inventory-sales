<template>
  <div class="zzljDiv">

    <el-form :inline="true" size="small">
      <el-form-item label="开始时间:" >{{beginDateTime}}</el-form-item>
      <el-form-item label="结束时间时间:" >{{endDateTime}}</el-form-item>
      <el-form-item label="开始索引:" >{{zzljStart}}</el-form-item>
      <el-form-item label="结束索引:" >{{zzljEnd}}</el-form-item>
      <el-form-item label="时间段数量:" >{{zzljEnd-zzljStart}}</el-form-item>
    </el-form>
    <div :style="{'width':((zzljEnd-zzljStart)*130+100 )+'px'}" :key="reloadZZLJKey">
      <div class="headerItem " style="width: 100px"> 机器名称</div>
      <span class="headerItem  header" v-for="(index,i) in zzljEnd-zzljStart" style="width: 130px;text-align: center">
        {{ formatDate(new Date((zzljStart * 1000 * timeInterval) + index * 1000 * timeInterval)).substr(0, 10) }}
        <br/>
        {{ formatDate(new Date((zzljStart * 1000 * timeInterval) + index * 1000 * timeInterval)).substr(11) }}
      </span>

      <div v-for="(m,i) in machineList">
        <div class="headerItem  orderNoDiv" style="width: 100px">{{ m.machineName }}</div>
        <div class="headerItem orderNoDiv" :id="m.machineId+'_'+i" v-for="(index,i) in zzljEnd-zzljStart" style="width: 130px;text-align: left">
          <div v-if="orderNoTimeMap[m.machineId + '_' + index] && orderNoTimeMap[m.machineId + '_' + index].length>0">
          <div class="orderNoInfo" :style="{'z-index': index,'width': o.colSpan*130 +'px','backgroundColor':colorMap[o.orderNo]}"
                 v-for="(o,i) in  ( orderNoTimeMap[m.machineId + '_' + index])"
            >{{
                o.orderNo
              }}
            </div>
          </div>
        </div>
        <hr/>
      </div>

    </div>
  </div>
</template>
<script>
import { post } from '@/api/common'
import { formatDate, groupBy } from '@/utils/formatDate'

export default {
  name: 'MachineResult.vue',
  props: {
    id: {},
    timeInterval: {}
  },
  watch:{
    timeInterval:{

    }
  },
  data() {
    return {
      // apsSchedulingDayConfigVersionDetailMachineList: [],
      machineList: [{
        machineId:"",
        machineName:"",
      }],
      beginDateTime: null,
      endDateTime: null,
      zzljStart: 0,
      zzljEnd: 0,
      orderNoTimeMap: {},
      reloadZZLJKey: Math.random() + '',
      colorMap: {}
    }
  },

  created() {
    this.reloadZZLJ()
  },

  methods: {
    formatDate,
    reloadZZLJ() {
      for (let k in this.orderNoTimeMap) {
        this.$delete(this.orderNoTimeMap, k)
      }
      this.machineList.splice(0, this.machineList.length)
      this.zzljStart = 0
      this.zzljEnd = 0
      this.$forceUpdate()
      post('/apsSchedulingDayConfigVersionDetailMachine/queryList', { data: { schedulingDayId: this.id } }, false).then(r => {
        // console.info(r)
        let ll = r.data.dataList
        if (ll) {
          ll.forEach(o => {
            let t = this.colorMap[o.orderNo]
            if (t === undefined) {
              this.colorMap[o.orderNo] = this.getRandomShallowColor()
            }
            // console.info(o.machineName, o.orderNo, o.beginDateTime, o.endDateTime)
          })
          let  apsSchedulingDayConfigVersionDetailMachineList = groupBy(ll, 'machineName')
          this.beginDateTime = ll.map(t => t.beginDateTime).sort()[0]
          this.endDateTime = ll.map(t => t.endDateTime).sort()[ll.length - 1]
          this.zzljStart = this.getTimeInterval(this.beginDateTime)-1
          this.zzljEnd = this.getTimeInterval(this.endDateTime)
          for (let k in apsSchedulingDayConfigVersionDetailMachineList) {
            let orderList = apsSchedulingDayConfigVersionDetailMachineList[k]
            this.machineList.push(orderList[0])
            // this.$forceUpdate()
            orderList.forEach(o => {
              let obI = this.getTimeInterval(o.beginDateTime)
              let ebI = this.getTimeInterval(o.endDateTime)
              var elementId = o.machineId + '_' + (obI - this.zzljStart)
              let t = this.orderNoTimeMap[elementId]
              o.colSpan = ebI - obI + 1
              if (t) {
                this.orderNoTimeMap[elementId].push(o)
              } else {
                this.orderNoTimeMap[elementId] = [o]
              }
              this.$forceUpdate()
              // this.$set( this.orderNoTimeMap,,'设置的属性值')
            })
            //
          }
          console.info(this.beginDateTime, this.endDateTime, this.zzljStart, this.zzljEnd, this.zzljEnd - this.zzljStart, this.machineList, this.orderNoTimeMap)
        }
        this.reloadZZLJKey = Math.random() + ''
        for (var k in this.orderNoTimeMap) {
          console.info(this.orderNoTimeMap[k][0].machineName, k, this.orderNoTimeMap[k])
        }
      })

    },
    getTimeInterval(time) {

      return parseInt(new Date(Date.parse(time)).getTime() / 1000 / this.timeInterval + '')
    },
    getRandomShallowColor() {
      const maxValue = 255
      const shallowValue = 200  // 假设浅色的明度是最大值的一半
      const randomValue = () => Math.random() * shallowValue + shallowValue / 2 // 生成位于半明度和最大值之间的随机数
      return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`
    }
  }
}
</script>
<style scoped lang="scss">

.headerItem {
  display: inline-flex;
}

.zzljDiv {
  overflow-x: scroll;
  margin: 5px;
}

.zzljDiv > div > div.header {
  border-right: 1px solid #00D3E9;
}

div.orderNoInfo {
  line-height: 25px;
  height: 25px;
  border: 1px solid #dddddd;
}

div.orderNoDiv {
  line-height: 30px;
}
</style>
