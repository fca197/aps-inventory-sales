# 安装文档

# 前端

## 前端配置

| 硬件  | 配置 | 说明 |
|-----|----|----|
| CPU | 1核 |    |
| 内存  | 2G |    | 

### 后端软件配置

| 软件     | 版本      | 说明       |
|--------|---------|----------| 
| nodejs | 10.15.3 | nodejs版本 |
| yarn   | 1.22.19 | yarn版本   | 

### 安装步骤

0. 镜像
```shell

// 查询源
yarn config get registry

// 更换国内源
yarn config set registry https://registry.npmmirror.com

// 恢复官方源
yarn config set registry https://registry.yarnpkg.com

// 删除注册表
yarn config delete registry


// 查询源
npm config get registry

// 更换国内源
npm config set registry https://registry.npmmirror.com

// 恢复官方源
npm config set registry https://registry.npmjs.org

// 删除注册表
npm config delete registry

```

1. 下载源码

```bash
    
    git clone https://gitee.com/slsplatform/aps-inventory-sales.git
    
```

2. 切换到项目目录,并修改mysql,redis配置

```bash
    cd  aps-inventory-sales
    # 安装依赖
    yarn install
    
```

3. 编译打包

```bash

   shh build.sh

```

4. 获取打包文件

```bash

    dist/aps.zip
    
```

5. nginx 配置 /etc/nginx/conf.d/域名.conf

```azure
 server {
 #HTTPS的默认访问端口443。
 #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
 listen 443 ssl  http2;
 
 #填写证书绑定的域名
 server_name {{域名}}; 

 #填写证书文件绝对路径
 ssl_certificate /etc/nginx/cert/{{域名}}.pem;
 #填写证书私钥文件绝对路径
 ssl_certificate_key /etc/nginx/cert/{{域名}}.key;

 ssl_session_cache shared:SSL:1m;
 ssl_session_timeout 5m;

 #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）
 #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。
 ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
 ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

 #表示优先使用服务端加密套件。默认开启
 ssl_prefer_server_ciphers on;

  error_page 404 /404.html;
        location = /40x.html {
    }
    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
    location / {
            root /opt/aps;
    }
    location /api {
        proxy_pass http://{{后端服务器地址}}:8080;
        add_header Cache-Control no-cache;
        add_header Pragma no-cache;
        add_header Expires 0;
        proxy_set_header Host $host;  
        proxy_set_header X-Real-IP $remote_addr;  
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
        proxy_set_header X-Forwarded-Proto $scheme;  
        proxy_set_header X-Forwarded-Host $host;  
        proxy_set_header X-Forwarded-Port $server_port;  
        proxy_set_header X-Forwarded-Uri $request_uri;  # 添加这一行来传递原始请求的URI 
        proxy_set_header X-Forwarded-Url $request_uri;  # 添加这一行来传递原始请求的URL

    } 
}  

```

6. 启动app

```bash

    cd /opt/aps
    # 存放aps.zip
    unzip aps.zip
    
```

7. 启动nginx

```shell
     nginx -s reload
```
