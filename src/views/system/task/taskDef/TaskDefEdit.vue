<template>
  <div>
    <draggable-element></draggable-element>
  </div>
</template>

<script>
import DraggableElement from '@/views/system/task/taskDef/DraggableElement.vue'

export default {
  components: {
    DraggableElement
  },
  mounted() {

  }
}
</script>


<style scoped>
.draggable {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: move;
}
</style>
