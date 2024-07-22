<template>
  <div class="app-container">

  </div>
</template>

<script>
import { post } from '@/api/common'

export default {
  name: 'detailList',
  data() {
    return {
      id: this.$route.query.id
    }
  },
  created() {

    this.getList()
  },
  methods: {
    getList() {

      post('/apsSchedulingDayConfigVersion/detailList', { id: this.id },false).then(t => {
        console.info(t)
      })
    }
  }
}

</script>


<style scoped lang="scss">

</style>
