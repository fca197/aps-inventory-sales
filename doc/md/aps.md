[返回](../../README.md)

```mermaid
sequenceDiagram 
autonumber
title: aps 系统流转
participant U as 用户
participant G as 商品
participant GS as 状态
participant WGD as 工段
participant WGW as 工位
participant PP as 工艺路径
participant SG as 销售特征
participant F as 预测
participant FM as 预测主版本
participant FPW as  预测打散(周)
participant FPD as  预测打散(天)
participant O as  订单
participant CN as  产能
participant P as  排产
participant PART as  零件
rect rgb(235, 250, 230)
    note over U,PP: 基础配置
    U-->>WGD: 添加工段 
    U-->>GS: 添加状态
    U-->>WGW: 添加工位
    U-->>PP: 添加工路径
end
U->>G: 添加商品
G->>SG: 配置销售特征

rect rgb(235, 250, 230)
    note over U,F: 预测模块
    U-->>F: 开始预测
    F-->>U: 预测模板下载
    U->>U: 模板填写
    U-->>F: 预测数据上传
    F-->>F: 预测开始
    F-->>U: 预测结果显示
    note over FM: 预测主版本
    F->>FM: 发布到主板本
end
FM->>FPW: 发布到预测打散(周)
FPW->>FPD: 发布到预测打散(天)
U->>O: 订单录入 
U-->>CN: 产能维护
U-->>P: 排产
P-->>P: 选择排产模式
P-->>U: 排产结果显示
P-->>PART: 零件生成
PART-->>PART: 零件统计
PART-->>U: 零件统计结果显示
``` 

---

```mermaid
stateDiagram-v2
title: aps流程
开始-->基础配置:  初始化各种配置,工厂, 车间, 工艺, 工段, 工位, 状态
用户-->预测: 创建预测版本
预测-->预测结果: 下载模板, 上传模板, 开始计算, 获取结果
预测结果-->预测主版本: 预测结果发布到主版本

用户获取预测主版本-->预测打散(周): 从主版本获取数据到预测打散(周)
预测打散(周)--> 预测打散(周)主版本: 预测打散(周)发布到主版本
预测打散(周)主版本-->预测打散(天): 从预测打散(周)获取数据到预测打散(天)
预测打散(天)--> 预测打散(天)主版本: 预测打散(天)发布到主版本


```

[返回](../../README.md)
