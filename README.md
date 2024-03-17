
# 功能点

## 用户管理

|                                  | 功能点  | 说明 | 备注 |
|----------------------------------|------|----|----|
| <input type="checkbox"  checked> | 用户注册 |    |    |
| <input type="checkbox"  checked> | 用户列表 |    |    |
| <input type="checkbox"  checked> | 登录   |    |    | 
| <input type="checkbox" checked > | 登出   |    |    | 
| <input type="checkbox" checked > | 重置密码 |    |    |

## 租户管理

|                                  | 功能点  | 说明 | 备注 |
|----------------------------------|------|----|----|
| <input type="checkbox"  checked> | 租户注册 |    |    |
| <input type="checkbox"  checked> | 租户列表 |    |    |
| <input type="checkbox"  checked> | 租户详情 |    |    |
| <input type="checkbox" checked > | 租户创建 |    |    |
| <input type="checkbox" checked > | 租户更新 |    |    |
| <input type="checkbox" checked > | 租户删除 |    |    |

## 工厂管理

|                                  | 功能点  | 说明 | 备注 |
|----------------------------------|------|----|----|
| <input type="checkbox"  checked> | 工厂列表 |    |    |
| <input type="checkbox" checked > | 工厂创建 |    |    |
| <input type="checkbox" checked > | 工厂更新 |    |    |
| <input type="checkbox" checked > | 工厂删除 |    |    |
| <input type="checkbox" checked > | 工厂详情 |    |    |

## 楼层管理

|                                  | 功能点  | 说明 | 备注 |
|----------------------------------|------|----|----|
| <input type="checkbox"  checked> | 楼层列表 |    |    |
| <input type="checkbox" checked > | 楼层创建 |    |    |
| <input type="checkbox" checked > | 楼层更新 |    |    |
| <input type="checkbox" checked > | 楼层删除 |    |    |
| <input type="checkbox" checked > | 楼层详情 |    |    |

## 楼层管理

|                                  | 功能点    | 说明 | 备注 |
|----------------------------------|--------|----|----|
| <input type="checkbox"  checked> | 楼层列表   |    |    |
| <input type="checkbox" checked > | 楼层创建   |    |    |
| <input type="checkbox" checked > | 楼层批量创建 |    |    |
| <input type="checkbox" checked > | 楼层更新   |    |    |
| <input type="checkbox" checked > | 楼层删除   |    |    |
| <input type="checkbox" checked > | 楼层详情   |    |    | 

## 房间管理

|                                  | 功能点    | 说明 | 备注 |
|----------------------------------|--------|----|----|
| <input type="checkbox"  checked> | 房间列表   |    |    |
| <input type="checkbox" checked > | 房间创建   |    |    |
| <input type="checkbox" checked > | 房间批量创建 |    |    |
| <input type="checkbox" checked > | 房间更新   |    |    |
| <input type="checkbox" checked > | 房间详情   |    |    |
| <input type="checkbox" checked > | 房间删除   |    |    |

## 资产管理

|                                  | 功能点    | 说明 | 备注 |
|----------------------------------|--------|----|----|
| <input type="checkbox"  checked> | 资产列表   |    |    |
| <input type="checkbox" checked > | 资产创建   |    |    |
| <input type="checkbox" checked > | 资产批量创建 |    |    |
| <input type="checkbox" checked > | 资产更新   |    |    |
| <input type="checkbox" checked > | 资产详情   |    |    |
| <input type="checkbox" checked > | 资产删除   |    |    |
| <input type="checkbox" checked > | 资产禁用   |    |    |

## 盘点管理

|                                  | 功能点  | 说明                    | 备注     |
|----------------------------------|------|-----------------------|--------|
| <input type="checkbox"  checked> | 盘点列表 |                       |        |
| <input type="checkbox" checked > | 盘点创建 |                       |        |
| <input type="checkbox" checked > | 盘点更新 |                       |        |
| <input type="checkbox" checked > | 盘点详情 | 支持房间全局统计, 房间资产统计,设备禁用 |        |
| <input type="checkbox" checked > | 盘点删除 |                       |        | 
| <input type="checkbox" checked > | 扫码盘点 | 禁用资产不可盘点,N秒内重扫资产改为启用  | N秒内可配置 |

## Uber-H3管理

|                                  | 功能点  | 说明 | 备注        |
|----------------------------------|------|----|-----------|
| <input type="checkbox"  checked> | H3接口 |    | 后期接入地图可使用 |

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

### mybatis-plus

| 组件名称                             | 描述     | 使用点                      |
|----------------------------------|--------|--------------------------|
| TenantLineInnerInterceptor       | 租户插件   | 按租户进行数据隔离                |
| OptimisticLockerInnerInterceptor | 乐观锁插件  | 避免全表操作                   |
| PaginationInnerInterceptor       | 分页操作   | 使用 page操作                |
| MyMetaObjectHandler              | 数据自动填充 | 对象集成 BaseEntity, 给指定字段赋值 |

### 后端参数(peanut:)

| 参数名称 | 参数类型 | 参数说明 | 备注 |
|------|------|------|----|

### 初始化类

| 初始化类                  | 说明       | 备注                                   |
|-----------------------|----------|--------------------------------------|
| MockResourceLoad      | mock数据配置 | 返回接口的mock值                           |
| DbInitConfig          | 数据库初始化操作 | 指定包名下查找类的BelongDb 注解,进行数据库表字段的初始化与修改 |
| ResultResponseWrapper | 接口返回值修改  | 根据请求头判断返回值是否进行二次包装                   |
| ServiceNotice         | 通知类接口    | 可以接入钉钉机器人等                           |
| WebBeanConfig         | web配置    | 字段序列化等配置,字段指定时MaskValue进行数据脱敏        |

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

# TODO:

- [X]  待实现
- [ ] 角色管理
- [ ] 菜单管理
- [ ] 产品管理
- [ ] 订单管理
- [ ] 销售报表
- [ ] 产品购买
- [ ] 利润管理

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

##  扫码盘点
![扫码盘点](doc/img/scan-qr-code.jpg)

