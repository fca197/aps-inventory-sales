<template>

  <div>

    <div ref="parent" class="parent">
      <svg ref="svg" class="line-container" v-for="line in lineList">
        <line
          :x1="line.sx"
          :y1="line.sy"
          :x2="line.tx"
          :y2="line.ty"
          stroke="black"
          stroke-width="2"
        >
        </line>
      </svg>
      <div v-for="(item, index) in taskList" :key="index" :data-y="item.y" :data-x="item.x" ref="draggableTaskList" @mousedown="startDrag(index)">
        <div v-if="item.taskType==='BEGIN'" class="beginDiv">
          <div style="margin: 66px  58px">开始</div>
        </div>
        <div v-if="item.taskType==='JAVA_BEAN'" class="draggable">
          <h3> {{ item.taskName }}</h3>
          <el-divider/>
          <h1 style="text-align: center; color: #ed5565">JAVA</h1>
        </div>
        <div v-if="item.taskType==='HTTP'" class="draggable">
          <h3> {{ item.taskName }}</h3>
          <el-divider/>
          <h1 style="text-align: center;color: #1482f0">HTTP</h1>
        </div>
        <div v-if="item.taskType==='END'" class="endDiv">
          <div style="margin: 66px  58px">结束</div>
        </div>
      </div>


    </div>
    <div style="text-align: right">
      <el-button type="success" @click="editTaskKey=Math.random();editTask=true" size="mini">添加节点</el-button>
      <el-button type="primary" @click="updateTaskContent" size="mini">保存</el-button>
    </div>
    <el-dialog title="节点编辑" :visible.sync="editTask" :key="editTaskKey" :close-on-press-escape="false" :modal="false">
      <create-task :task-def-list="taskList" :edit-task="editTask" :editTaskClose="editTaskClose"></create-task>
    </el-dialog>
  </div>
</template>

<script>
import CreateTask from '@/views/system/task/taskDef/CreateTask.vue'
import { getById, updateById } from '@/api/common'

export default {
  components: {
    CreateTask
  },
  props: {
    taskId: {
      type: String
    }
  },
  data() {
    return {

      lineList: [],
      taskList: [
        { id: '0', x: 0, y: 0, taskName: '第1个', type: 'BEGIN' },
        // { id: '1', x: 10, y: 20, taskName: '第2个', sourceTaskId: '0', sourceTaskCondition: '', type: 'javaBean' },
        // { id: '2', x: 400, y: 290, taskName: '第3个', sourceTaskId: '1', sourceTaskCondition: '', type: 'javaBean' },
        // { id: '3', x: 290, y: 60, taskName: '第4个', sourceTaskId: '1', sourceTaskCondition: '', type: 'http' },
        // { id: '4', x: 610, y: 190, taskName: '第5个', sourceTaskId: '2', sourceTaskCondition: '', type: 'javaBean' },
        // { id: '9', x: 210, y: 130, taskName: '第6个', sourceTaskId: '4', sourceTaskCondition: '', type: 'end' },
        // { id: '19', x: 440, y: 330, taskName: '第9个', sourceTaskId: '3', sourceTaskCondition: '', type: 'end' }
      ], // 创建 3 个可拖拽元素，可根据需要修改数量
      isDragging: false,
      editTask: false,
      offsetX: 0,
      offsetY: 0,
      editTaskKey: 0,
      currentIndex: null,
      taskInfo:{}
    }
  },
  mounted() {
    document['pagePath'] = '/taskDef'
    console.log(this.taskId)
    getById({ idList: [this.taskId] }).then(t => {
      this.taskList.splice(0, this.taskList.length)
      this.taskInfo=t.data.dataList[0];
      let taskDefContent = this.taskInfo.taskDefContent
      if (taskDefContent && taskDefContent.length > 2) {
        this.taskList = JSON.parse(taskDefContent)
      } else {
        this.taskList.push({ id: '0', x: 0, y: 0, taskName: '开始', type: 'BEGIN' })
      }
      this.drawTask()
    })

  },
  methods: {
    drawTask() {
      this.lineList.splice(0, this.lineList.length)
      this.taskList.forEach(t => {
        t.x_ = t.x + 75
        t.y_ = t.y + 75
      })
      this.taskList.forEach(t => {
        // console.info(t)
        this.taskList.filter(st => st.id === t.sourceTaskId).forEach(st => {
          let l = { sx: st.x_, sy: st.y_, tx: t.x_, ty: t.y_ }
          // console.info(l, st, t)
          this.lineList.push(l)
        })
      })

      // 设置所有可拖拽元素的初始定位
      this.$refs.draggableTaskList.forEach((div) => {
        div.style.position = 'absolute'
        let x = div.getAttribute('data-x')
        let y = div.getAttribute('data-y')
        // console.log(x, y)
        div.style.left = x + `px`
        div.style.top = y + `px`
      })
    },

    startDrag(index) {
      this.isDragging = true
      this.currentIndex = index
      const draggableDiv = this.$refs.draggableTaskList[index]
      // 计算鼠标相对于元素左上角的偏移量
      this.offsetX = event.clientX - draggableDiv.offsetLeft
      this.offsetY = event.clientY - draggableDiv.offsetTop
      // 监听鼠标移动和鼠标抬起事件
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    drag() {
      if (this.isDragging) {
        const parentRect = this.$refs.parent.getBoundingClientRect()
        const draggableDiv = this.$refs.draggableTaskList[this.currentIndex]
        const draggableRect = draggableDiv.getBoundingClientRect()

        // 计算新的位置
        let newX = event.clientX - this.offsetX
        let newY = event.clientY - this.offsetY

        // 限制元素在父元素内移动
        newX = Math.max(0, Math.min(newX, parentRect.width - draggableRect.width))
        newY = Math.max(0, Math.min(newY, parentRect.height - draggableRect.height))
        this.taskList[this.currentIndex].x = newX
        this.taskList[this.currentIndex].y = newY
        // 更新元素的位置
        draggableDiv.style.left = `${newX}px`
        draggableDiv.style.top = `${newY}px`
        this.drawTask()
      }
    },
    stopDrag() {
      this.isDragging = false
      // 移除鼠标移动和鼠标抬起事件监听
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    editTaskClose() {
      this.editTask = false
      this.$nextTick(() => this.drawTask())
    },
    updateTaskContent(){
     let str = JSON.stringify( this.taskList)
      let  data={...this.taskInfo,taskDefContent:str}
      updateById(data).then(t=>{
        if (t.code===200){
          this.$message.success("成功");

        }else {
          this.$message.error("失败");
        }
      })
    }
  }
}
</script>

<style scoped>
.parent {
  margin-bottom: 30px;
  position: relative;
  width: 1360px;
  height: 700px;
  border: 1px solid #ccc;
  background: linear-gradient(to bottom,
  transparent 49%,
  transparent 49%,
  black 50%,
  black 51%,
  transparent 52%,
  transparent 50%
  );
  background-size: 100% 30px; /* 控制横线间距 */

}

.beginDiv {
  width: 150px;
  height: 150px;
  cursor: move;
  border-radius: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #20B2AA;

}

.endDiv {
  width: 150px;
  height: 150px;
  cursor: move;
  border-radius: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #ed5565;
}

.draggable {
  padding: 5px;
  width: 150px;
  height: 150px;
  background-color: lightblue;
  cursor: move;
  z-index: 4000;
  border-radius: 10px;
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}


</style>
