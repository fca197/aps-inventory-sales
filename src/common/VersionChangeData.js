const versionChangeData = [{
  time: '2024-03-17', title: '项目初始化', content: '整合从上班到目前现有项目经验'
}, {
  time: '2024-03-18',
  title: '资产盘点项目',
  content: '包含工厂, 楼层,房间, 资产录入管理, 资产扫码盘点'
}, {
  time: '2024-03-19',
  title: '进存销项目',
  content: '包含商品管理, 订单生成, 商品盘点,采购计划,采购单 等功能'
}, {
  time: '2024-03-29', title: 'APS系统', content: '商品管理,商品预测版本完成'
}, {
  time: '2024-04-01', title: 'APS系统', content: '通用状态,车间,工段,工位,工艺路径开发完成'
}, {
  time: '2024-04-02', title: 'APS系统', content: '工艺路径,预测主版本开发完成'
}, {
  time: '2024-04-03', title: 'APS系统', content: '预测主版本查询,BOM管理开发完成'
}, {
  time: '2024-04-05', title: 'APS系统', content: '预测主版本打散开发完成'
}, {
  time: '2024-04-08', title: 'APS系统', content: '预测周生产发布开发完成'
}, {
  time: '2024-04-13', title: 'APS系统', content: '订单, 工厂产能,销售产能,排产约束开发完成'
}, {
  time: '2024-04-16', title: 'APS系统', content: '排产开发完成'
}, {
  time: '2024-04-28', title: 'APS系统', content: '商品销售转规划开发完成'
}, {
  time: '2024-05-10', title: 'APS系统', content: '班次修改完成'
}, {
  time: '2024-05-15', title: 'APS系统', content: '根据预测计算BOM使用'
}, {
  time: '2024-06-01', title: 'APS系统', content: '部分BUG修正'
}, {
  time: '2024-06-03', title: 'APS系统', content: '排产增加bom使用统计查询完成'
}, {
  time: '2024-06-04', title: 'APS系统', content: '切换数据库, 废除sqlite 使用mysql 8完成'
}, {
  time: '2024-06-05', title: 'APS系统', content: '排产版本增加零件汇总统计入口,基于库存增加零件购买计划'
}, {
  time: '2024-06-06', title: 'APS系统', content: '抽取BOM基础,商品关联BOM,修改排产零件生成BUG'
}, {
  time: '2024-06-07',
  title: 'APS系统',
  content: '价格 库存等字段改为 BigDecimal 类型, 增加参数校验,增加帮助中心'
}, {
  time: '2024-06-14',
  title: 'APS系统',
  content: '订单列表增加订单节点经过时间,目前以基于排产时间和工艺路径推算每个节点的日期'
}, {
  time: '2024-06-16', title: 'APS系统', content: '增加订单进度一览表'
}, {
  time: '2024-06-18', title: 'APS系统', content: '增加订单进度中订单节点过期提醒(页面,非消息)'
}, {
  time: '2024-06-20', title: 'APS系统', content: '增加基本配置->零件组'
}, {
  time: '2024-06-21', title: 'blog系统', content: '增加blog组, 博客列表,'
}, {
  time: '2024-07-05', title: 'APS系统', content: '增加表格标题管理'
}
  , {
    time: '2024-07-14', title: 'APS系统', content: '增加滚动预测中需要的工厂产能管理'
  }, {
    time: '2024-07-19', title: 'APS系统', content: '增加滚动预测物流路径'
  }, {
    time: '2024-07-20', title: 'APS系统', content: '增加排产发布订单列表,增加排程版本创建'
  }

]

versionChangeData[versionChangeData.length - 1].color = '#FF3EB4'
versionChangeData.reverse()
export default versionChangeData
