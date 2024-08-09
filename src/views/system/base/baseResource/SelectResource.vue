<template>
  <div class="app-container" style="margin-top: -30px" :key="time">

    <el-tree
        :default-checked-keys="selectResourceList"
        :data="allResourceTree"
        node-key="id"
        default-expand-all
        :props="{
            label: 'treeName',
            children: 'children'
            } "
        show-checkbox
        ref="tree"
    />
    <div class="right">
      <el-button type="primary" @click="submitAppForm">确 定</el-button>
      <el-button @click="baseConfig.cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { post, queryUrlNoPageList, queryUrlPageList } from '@/api/common'
import { handleTree } from '@/utils/ruoyi'

export default {
  name: 'SelectResource.vue',
  props: {
    baseConfig: {
      title: '',
      menuOpen: false,
      cancel: {}
    },
    saveUrl: {},
    targetId: {},
    saveObjectField: {},
    saveResourceField: {},
    queryUrl: {},
    queryConfig: {}
  },
  data() {
    return {
      time: new Date().getTime(),
      allResourceTree: [],
      selectResourceList: []
    }
  },
  created() {
    this.time = new Date().getTime()
    this.loadResource()
  },
  methods: {
    loadResource() {
      Promise.all([queryUrlNoPageList('/baseResource'), queryUrlPageList(this.queryUrl, { queryPage: false, data: this.queryConfig })])
      .then(vl => {
        let baseResource = vl[0]
        let ll = []
        baseResource.data.dataList.forEach(item => {
          item.treeName = item.resourceName + '(' + item.resourceCode + ')' + '(' + item.id + ')'
          ll.push(item)
        })
        this.allResourceTree = handleTree(ll, 'id', 'parentId')

        let rl = vl[1].data.dataList.map(item => item.resourceId)
        let rlt = []
        rl.forEach(r => {
          let length = baseResource.data.dataList.filter(item => item.parentId === r).length
          if (length === 0) {
            rlt.push(r)
          }
        })
        this.selectResourceList = rlt
      })
    },
    submitAppForm() {

      let checkedKeys = this.$refs.tree.getCheckedKeys()
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      let saveObj = {}
      saveObj[this.saveObjectField] = this.targetId
      saveObj[this.saveResourceField] = checkedKeys
      post(this.saveUrl + '/insertList', saveObj).then(() => this.baseConfig.cancel())
    }

  }
}
</script>


<style scoped lang="scss">

</style>
