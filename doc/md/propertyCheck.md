
[返回](../../README.md)

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

[返回](../../README.md)
