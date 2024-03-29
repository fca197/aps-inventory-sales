# 功能流程图

## 盘点

[流程图](./doc/md/propertyCheck.md)

## 进存销

[流程图](./doc/md/jcx.md)

## aps 功能

[流程图](./doc/md/aps.md)

# 功能点一览

❌: 不实现
⌛️: 后期实现
✅: 已实现

| 系统    |    模块    | 列表 | 增加 | 删除 | 修改 | 详情 | 其他              | 需求             |
|-------|:--------:|:--:|----|----|----|----|-----------------|:---------------|
| basic |   用户管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 登录,登出           |                |
| basic |   租户管理   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                |
| basic |   消息中心   | ✅  | ❌  | ❌  | ❌  | ✅  | 已读              |                |
| basic |   H3接口   | ❌  | ❌  | ❌  | ❌  | ❌  | H3 API接口已接入     |                |
| basic |   工厂管理   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                |
| basic |   文件管理   | ✅  | ✅  | ✅  | ⌛️ | ✅  |                 |                |
| basic | 动态表头(后)  | ✅  | ✅  | ✅  | ✅  | ❌  |                 |                |
| basic |   日历管理   |    |    |    |    |    |                 |                |
| 盘点    |   楼层管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 批量创建            |                |
| 盘点    |   房间管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 批量创建            |                |
| 盘点    |   资产管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 资产禁用,批量创建,生成二维码 | 增加资产使用人        |
| 盘点    |   盘点管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 扫码盘点,下载         | 盘点快照           |
| 进存销   |   商品管理   | ✅  | ✅  | ✅  | ✅  | ❌  | 生成条形码,库存预警,每日盘点 | 销售数据           |
| 进存销   |   订单管理   | ✅  | ✅  | ❌  | ❌  | ✅  |                 |                |
| 进存销   |   财务管理   | ⌛️ | ⌛️ | ⌛️ | ⌛️ | ⌛️ |                 | 收支统计,财务分析,财务报告 |
| 进存销   |  供应商管理   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                |
| 进存销   |   采购计划   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                |
| 进存销   |   采购订单   | ✅  | ✅  | ✅  | ❌  | ✅️ | 驳回,预览           |                |
| 进存销   |   入库管理   | ⌛️ | ⌛️ | ⌛️ | ⌛️ | ⌛️ |                 |                |
| aps   |   商品管理   |    |    |    |    |    |                 |                |
| aps   |  销售特征管理  |    |    |    |    |    |                 |                |
| aps   | 商品销售特征绑定 |    |    |    |    |    |                 |                |
| aps   | 工程特征组管理  |    |    |    |    |    |                 |                |
| aps   | 销售转特征管理  |    |    |    |    |    |                 |                |
| aps   |  零件管理管理  |    |    |    |    |    |                 |                ||
| aps   | 预测特征组管理  |    |    |    |    |    |                 |                |
| aps   |  流水线管理   |    |    |    |    |    |                 |                |
| aps   |   预测管理   |    |    |    |    |    |                 |                |
| aps   |   订单管理   |    |    |    |    |    |                 |                |
| aps   |   排产管理   |    |    |    |    |    |                 |                |
| aps   |   零件使用   |    |    |    |    |    |                 |                |

# 技术栈

## 后端

| 组建名称              | 依赖版本         | 说明                 |
|-------------------|--------------|--------------------|
| JDK               | jdk 17       | Jdk最低版本            |
| Spring Boot       | 3.2.0        | springboot版本       |
| mybatis-plus      | 3.5.3.1      | mybatisplus版本      |
| mybatis-plus-join | 1.4.8.1      | mybatisplus-join版本 |
| sqlite-jdbc       | 3.45.1.0     | sqlite驱动版本         |
| lombok            | 1.18.22      | lombok版本           |
| uber-h3           | 4.1.1        | 经纬度转code码          |
| hutool            | 5.8.0        | 常用工具库              |
| org.kie           | 7.14.0.Final | 规则引擎               |
| fastjson2         | 2.0.46       | json 插件            |
| ortools-java      | 9.9.3963     | 计算插件               |

# 数据库

| 组建名称        | 依赖版本     | 说明         |
|-------------|----------|------------|
| sqlite-jdbc | 3.45.1.0 | sqlite驱动版本 |
| h2          | 2.2.224  | h2驱动版本     |

## 前端

| 组建名称           | 依赖版本    | 说明                  |
|----------------|---------|---------------------|
| ruoyi          | 3.8.6   | vue版本               |
| qrcodejs       | 1.0.0   | 条形码生成               |
| qrcodejs2      | 0.0.2   | 二维码生成,必须在https下才能使用 |
| @zxing/library | ^0.20.0 | 二维码扫描               |

# 页面展示

## 登录页面

![首页](doc/img/login.jpg)

## 用户管理

![用户管理](doc/img/user.jpg)

## 工厂管理

![工厂管理](doc/img/factory.jpg)

## 楼层管理

![楼层管理](doc/img/storey.jpg)

## 楼层批量添加

![楼层批量添加](doc/img/storey-batch-add.jpg)

## 房间管理

![房间管理](doc/img/room.jpg)

## 房间批量添加

![房间批量添加](doc/img/room-batch-add.jpg)

## 资产管理

![资产管理](doc/img/property.jpg)

## 资产二维码

![资产二维码](doc/img/property-qr-code2.jpg)

## 资产批量添加

![资产批量添加](doc/img/property-batch-add.jpg)

## 盘点管理

![盘点管理](doc/img/report.jpg)

## 盘点概况

![盘点概况](doc/img/report-factory-data.jpg)

## 房间内盘点详情

![房间内盘点详情](doc/img/report-room-data.jpg)

## 扫码盘点

![扫码盘点](doc/img/scan-qr-code.jpg)

## 盘点下载

![盘点下载](doc/img/chec-report-facory.jpg)

![盘点下载](doc/img/chec-report-room.jpg)

## 品牌管理

![管理](doc/img/brand-list.jpg)
![新增](doc/img/brand-add.jpg)
![修改](doc/img/brand-update.jpg)
![删除](doc/img/brand-delete.jpg)

## 文件管理

![文件管理](doc/img/file-list.jpg)
![文件上传](doc/img/file-add.jpg)
![文件删除](doc/img/file-delete.jpg)

## 商品管理

![商品管理](doc/img/goods-list.jpg)
![商品添加](doc/img/goods-add.jpg)
![商品修改](doc/img/goods-update.jpg)
![商品删除](doc/img/goods-delete.jpg)

## 订单管理(商品)

![订单管理](doc/img/jcx-order-list.jpg)
![订单添加](doc/img/jcx-order-add.jpg)
![订单修改](doc/img/jcx-order-update.jpg)
![订单删除](doc/img/jcx-order-delete.jpg)

## 预警管理

![预警管理](doc/img/jcx-goods-warning-list.jpg)
![预警添加](doc/img/jcx-goods-warning-add.jpg)

## 采购计划

![采购计划](doc/img/jcx-buy-plan-list.jpg)
![采购计划添加](doc/img/jcx-buy-plan-add.jpg)
![采购计划修改](doc/img/jcx-buy-plan-update.jpg)
![采购计划删除](doc/img/jcx-buy-plan-delete.jpg)
![采购计划审批](doc/img/jcx-buy-plan-oper.jpg)

## 采购订单

![采购订单](doc/img/jcx-buy-order-list.jpg)
![采购订单添加](doc/img/jcx-buy-order-add.jpg)
![采购订单修改](doc/img/jcx-buy-order-update.jpg)
![采购订单删除](doc/img/jcx-buy-order-delete.jpg)

