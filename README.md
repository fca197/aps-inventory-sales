# 开发进度图

```mermaid
gantt
dateFormat YYYY-MM-DD
title 开发进度
excludes weekends
%% （excludes 参数接受 YYYY-MM-DD 格式的具体日期、星期几（例如“sunday”）
section 商品管理
商品管理: done, goods_list, 2024-03-19,1d
商品添加: active,  after goods_list ,0.5d
商品删除: goods_delete, after goods_add ,1d
section 订单管理
订单录入:  done, order_add, 2024-03-19, 1d
订单修改:  orde_update, after order_add, 1d

section 需求池
角色管理: ,,
菜单管理: ,,
产品管理: ,, 
订单管理: ,, 
销售报表: ,,
产品购买: ,,
利润管理: ,,
页面校验: ,,
工作流接入: ,,
第三方接入: ,,
消息中心: ,,

```

# 功能流程图

## 盘点

```mermaid
sequenceDiagram
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

# 功能点

## 用户管理

- [X]  用户注册
- [X]  用户列表
- [X]  登录
- [X]  登出
- [X]  重置密码

## 租户管理

- [X]  租户列表
- [X]  租户详情
- [X]  租户创建
- [X]  租户更新
- [X]  租户删除
- [X]  租户详情

## 工厂管理

- [X]  工厂列表
- [X]  工厂创建
- [X]  工厂更新
- [X]  工厂删除
- [X]  工厂详情

## 楼层管理

- [X]  楼层列表
- [X]  楼层创建
- [X]  楼层更新
- [X]  楼层删除
- [X]  楼层详情

## 楼层管理

- [X]  楼层列表
- [X]  楼层创建
- [X]  楼层更新
- [X]  楼层删除
- [X]  楼层详情
- [X]  楼层批量创建

## 房间管理

- [X]  房间列表
- [X]  房间创建
- [X]  房间更新
- [X]  房间删除
- [X]  房间详情
- [X]  房间批量创建

## 资产管理

- [X]  资产列表
- [X]  资产创建
- [X]  资产批量创建
- [X]  资产更新
- [X]  资产详情
- [X]  资产删除
- [X]  资产禁用
- [ ]  资产使用人

## 盘点管理

- [X]  盘点列表
- [X]  盘点创建
- [X]  盘点更新
- [X]  盘点详情
- [X]  支持房间全局统计, 房间资产统计,设备禁用
- [X]  盘点删除
- [X]  扫码盘点
- [X]  禁用资产不可盘点,N秒内重扫资产改为启用
- [ ]  盘点快照
- [ ]  生成快照后,该盘点失效
- [X]  盘点信息下载
- [X]  支持下载总计与详情

## Uber-H3管理

- [X]  H3接口
- [X]  api 接口已全部接入

## 文件管理

- [ ]  文件上传
- [ ]  文件下载
- [ ]  文件删除
- [ ]  文件列表

## 文件管理

- [X]  文件列表
- [X]  文件创建
- [X]  文件更新
- [X]  文件删除
- [X]  文件详情

## 商品管理

- [ ]  商品列表
- [ ]  商品创建
- [ ]  商品更新
- [ ]  商品删除
- [ ]  商品详情
- [ ]  每日盘点
- [ ]  销售数据
- [ ]  库存数据
- [ ]  库存预警

## 订单管理

- [ ]  订单列表
- [ ]  订单创建
- [ ]  订单更新
- [ ]  订单详情
- [ ]  订单取消

## 财务管理

- [ ]  收支统计
- [ ]  财务分析
- [ ]  财务报告

## 供应商管理

- [ ]  供应商列表
- [ ]  供应商创建
- [ ]  供应商更新
- [ ]  供应商删除
- [ ]  供应商详情

## 采购管理

- [ ]  采购列表
- [ ]  采购创建
- [ ]  采购更新
- [ ]  采购详情
- [ ]  采购删除
- [ ]  定时采购

# 技术栈

## 后端


| 组建名称          | 依赖版本     | 说明                 |
| ----------------- | ------------ | -------------------- |
| JDK               | jdk 17       | Jdk最低版本          |
| Spring Boot       | 3.2.0        | springboot版本       |
| mybatis-plus      | 3.5.3.1      | mybatisplus版本      |
| mybatis-plus-join | 1.4.8.1      | mybatisplus-join版本 |
| sqlite-jdbc       | 3.45.1.0     | sqlite驱动版本       |
| lombok            | 1.18.22      | lombok版本           |
| uber-h3           | 4.1.1        | 经纬度转code码       |
| hutool            | 5.8.0        | 常用工具库           |
| org.kie           | 7.14.0.Final | 规则引擎             |
| fastjson2         | 2.0.46       | fastjson2版本        |

# 数据库


| 组建名称    | 依赖版本 | 说明           |
| ----------- | -------- | -------------- |
| sqlite-jdbc | 3.45.1.0 | sqlite驱动版本 |
| h2          | 2.2.224  | h2驱动版本     |

## 前端


| 组建名称       | 依赖版本 | 说明                             |
| -------------- | -------- | -------------------------------- |
| ruoyi          | 3.8.6    | vue版本                          |
| qrcodejs       | 1.0.0    | 条形码生成                       |
| qrcodejs2      | 0.0.2    | 二维码生成,必须在https下才能使用 |
| @zxing/library | ^0.20.0  | 二维码扫描                       |


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
