<template>
  <div ref="parent" class="parent">
    <svg ref="svg" class="line-container" v-for="line in lineList">
      <line
        :x1="line.sx"
        :y1="line.sy"
        :x2="line.tx"
        :y2="line.ty"
        stroke="black"
        stroke-width="2"
      />
      >
    </svg>
    <div v-for="(item, index) in taskList" :key="index" :data-y="item.y" :data-x="item.x" ref="draggableTaskList" @mousedown="startDrag(index)">
      <div v-if="item.type==='begin'" class="beginDiv">
        <div style="margin: 60px">开始</div>
      </div>
      <div v-if="item.type==='javaBean'" class="draggable">
        <h4> {{ item.taskName }}</h4>
        java 请求
        任务类型:{{ item.taskName }} <br/>
      </div>
      <div v-if="item.type==='http'" class="draggable">
        <h4> {{ item.taskName }}</h4>
        http请求
        任务类型:{{ item.taskName }} <br/>
      </div>
      <div v-if="item.type==='end'" class="endDiv">
        <div style="margin: 60px">结束</div>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      lineList: [],
      taskList: [
        { id: '0', x: 0, y: 0, taskName: '第1个', nextTask: [{ nextId: '1', conn: '' }], type: 'begin' },
        { id: '1', x: 10, y: 20, taskName: '第1个', nextTask: [{ nextId: '2', conn: '' }], type: 'javaBean' },
        { id: '2', x: 400, y: 290, taskName: '第2个', nextTask: [{ nextId: '4', conn: '' }], type: 'javaBean' },
        { id: '3', x: 290, y: 60, taskName: '第3个', type: 'javaBean' },
        { id: '4', x: 610, y: 190, taskName: '第4个', nextTask: [{ nextId: '9', conn: '' }], type: 'javaBean' },
        { id: '9', x: 210, y: 130, taskName: '第4个', nextTask: [{ nextId: '', conn: '' }], type: 'end' }
      ], // 创建 3 个可拖拽元素，可根据需要修改数量
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      currentIndex: null
    }
  },
  mounted() {
    this.drawTask()
  },
  methods: {
    drawTask() {

      this.lineList.splice(0, this.lineList.length)

      this.taskList.forEach(t => {
        if (t.type === 'begin') {
          // t.x-=100;
          // t.y-=100;
        }
        if (t.nextTask) {
          t.nextTask.forEach(ntt => {
            this.taskList.filter(st => st.id === ntt.nextId).forEach(tmp => {
              let x = t.x + 150
              let y = t.y + 150
              if (t.type === 'begin') {
                x -= 75
                y -= 75
              }

              let tx = tmp.x
              let ty = tmp.y
              if (tmp.type === 'end') {
                tx += 75
                ty += 75
              }
              this.lineList.push({ sx: x, sy: y, tx: tx, ty: ty })
            })
          })
        }
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
        // console.log(this.taskList[this.currentIndex])
        this.drawTask()
      }
    },
    stopDrag() {
      this.isDragging = false
      // 移除鼠标移动和鼠标抬起事件监听
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mouseup', this.stopDrag)
    }
  }
}
</script>

<style scoped>
.parent {
  position: relative;
  width: 915px;
  height: 550px;
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
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

}


</style>
