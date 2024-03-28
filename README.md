# 功能流程图

## 盘点

```mermaid
sequenceDiagram
autonumber
title: 用户资产盘点

participant U as 用户
participant F as 工厂
participant S as 楼层
participant R as 房间
participant P as 资产
participant C as 盘点
participant ST as 资产实体
U->>F: 用户录入工厂
F->>S: 用户录入楼层(可批量)
S->>R: 用户录入房间(可批量) 
R->>P: 用户录入资产(可批量)
P-->>P: 生成资产二维码(可批量)
P->>ST: 资产贴二维码
C-->>C: 创建盘点记录
loop 扫码盘点
    U-->>ST: 用户扫码资产二维码
    ST-->>C: 盘点信息自动录入
end
C-->>C: 盘点完成
C-->>C: 盘点报表查看(可下载)
```

## 进存销

```mermaid

sequenceDiagram
autonumber
title: 进存销盘点流程
participant U as 用户
participant BU as 用户购买
participant G as 商品
participant O as  订单
participant M as  消息
participant BB as  采购计划
participant BO as  采购订单


U->>G: 用户录入商品
BU->>G: 用户购买商品
G-->>U: 用户获取商品信息
U->>O: 用户下单
O->>O: 订单入库
O-->>BU: 用户买单
rect rgb(191, 223, 55)
Note over G: 商品每日盘点(自动)
end
G->>M: 发送商品盘点结果
M-->>U: 用户获取消息
G-->>BB: 生成采购计划
BB->>U: 用户获取采购计划
rect rgb(191, 223, 255)
Note over G,M:  以下待完成
end 
U->>BB: 用户审批采购计划
BB-->>BO: 合并购买计划生成采购订单
BO-->>BO: 采购单审批
rect rgb(11, 112, 12)
    note over BO: 根据采购单购买 
end
BO-->>G: 采购计划入库

```

## 购买流程

```mermaid
stateDiagram-v2
title: 购买计划状态管理
创建--> 草稿: [理货员]根据产品预警,创建购买计划
草稿 --> 待审核: [理货员]提交采购计划[采购部]
待审核 --> 审核通过: [采购部]采购审批通过
待审核 --> 驳回: [采购部]采购部驳回[理货员]
驳回 -->待审核: [理货员]提交采购计划[采购部]
```

# 功能点一览

❌: 不实现
⌛️: 后期实现
✅: 已实现

|   模块    | 列表 | 增加 | 删除 | 修改 | 详情 | 其他              | 需求                  |
|:-------:|----|----|----|----|----|:----------------|---------------------|
|  用户管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 登录,登出           |                     |
|  租户管理   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                     |
|  工厂管理   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                     |
|  楼层管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 批量创建            |                     |
|  房间管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 批量创建            |                     |
|  资产管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 资产禁用,批量创建,生成二维码 | 增加资产使用人             |
|  盘点管理   | ✅  | ✅  | ✅  | ✅  | ✅  | 扫码盘点,下载         | 盘点快照                |
|  H3接口   | ❌  | ❌  | ❌  | ❌  | ❌  | H3 API接口已接入     |                     |
|  文件管理   | ✅  | ✅  | ✅  |    | ✅  |                 |                     |
|  商品管理   | ✅  | ✅  | ✅  | ✅  |    | 生成条形码,库存预警      | 每日盘点,销售数据,库存数据,库存预警 |
|  订单管理   | ✅  | ✅  | ❌  | ❌  | ✅  |                 |                     |
|  财务管理   | ⌛️ | ⌛️ | ⌛️ | ⌛️ | ⌛️ |                 | 收支统计,财务分析,财务报告      |
|  供应商管理  | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                     |
|  采购计划   | ✅  | ✅  | ✅  | ✅  | ✅  |                 |                     |
|  采购订单   | ✅  | ✅  | ❌  | ❌  |    | 驳回              | 发送采购列表              |
|  入库管理   | ⌛️ | ⌛️ | ⌛️ | ⌛️ | ⌛️ |                 |                     |
| 动态表头(后) | ✅  | ✅  | ✅  | ✅  | ❌  |                 |                     |
|  消息中心   | ✅  | ❌  | ❌  | ❌  | ✅  |                 | 标记已读                |

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
| fastjson2         | 2.0.46       | fastjson2版本        |

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


