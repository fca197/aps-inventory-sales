const versionChangeData = [{
  time: '2024-03-17', title: "项目初始化", content: "整合从上班到目前现有项目经验"
}, {
  time: '2024-03-18',
  title: "资产盘点项目",
  content: "包含工厂, 楼层,房间, 资产录入管理, 资产扫码盘点"
}, {
  time: '2024-03-19',
  title: "进存销项目",
  content: "包含商品管理, 订单生成, 商品盘点,采购计划,采购单 等功能"
}, {
  time: '2024-03-29', title: "APS系统", content: "商品管理,商品预测版本完成",
}, {
  time: '2024-04-01', title: "APS系统", content: "通用状态,车间,工段,工位,工艺路径开发完成"
}, {
  time: '2024-04-02', title: "APS系统", content: "工艺路径,预测主版本开发完成"
}, {
  time: '2024-04-03', title: "APS系统", content: "预测主版本查询,BOM管理开发完成"
}, {
  time: '2024-04-05', title: "APS系统", content: "预测主版本打散开发完成"
}, {
  time: '2024-04-08', title: "APS系统", content: "预测周生产发布开发完成"
}, {
  time: '2024-04-13', title: "APS系统", content: "订单, 工厂产能,销售产能,排产约束开发完成"
}, {
  time: '2024-04-16', title: "APS系统", content: "排产开发完成"
}, {
  time: '2024-04-28', title: "APS系统", content: "商品销售转规划开发完成"
}, {
  time: '2024-05-10', title: "APS系统", content: "班次修改完成"
}, {
  time: '2024-05-15', title: "APS系统", content: "根据预测计算BOM使用"
}, {
  time: '2024-06-01', title: "APS系统", content: "部分BUG修正"
}, {
  time: '2024-06-03', title: "APS系统", content: "排产增加bom使用统计查询完成"
}, {
  time: '2024-06-04', title: "APS系统", content: "切换数据库, 废除sqlite 使用mysql 8完成"
}, {
  time: '2024-06-05', title: "APS系统", content: "排产版本增加零件汇总统计入口"
}

]

versionChangeData[versionChangeData.length - 1].color = "#FF3EB4"
versionChangeData.reverse();
export default versionChangeData
