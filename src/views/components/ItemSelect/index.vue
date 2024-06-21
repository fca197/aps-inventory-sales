<template>
  <div class="infinite-list" style="border: 1px solid #ccc; height: 600px">
    <div v-for="(item,index) in itemList" class="infinite-list-item" :key="index" @click="itemClick(index)">{{ item.name }}</div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    obj:{
      type: Object
    },
    itemList: {
      type: Array,
      default() {
        return []
      }
    },
    clickFun: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    itemClick(index) {
      let elementsByClassName = document.getElementsByClassName('infinite-list-item')
      for (let i = 0; i < elementsByClassName.length; i++) {
        elementsByClassName[i].style.backgroundColor = '#fff'
      }
      elementsByClassName[index].style.backgroundColor = '#a8c1f5'
      this.obj.groupId=this.itemList[index].id;
      this.clickFun();
    }
  }
}
</script>


<style lang="scss" scoped>
.infinite-list {
  padding: 10px 0;
}

.infinite-list-item {
  padding: 5px 10px;
  list-style-type: none;
  margin: 3px 0;
}

.infinite-list-item:hover {
  background-color: #a8c1f5;
  cursor: pointer;
}
</style>
