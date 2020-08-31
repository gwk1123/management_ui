## 开发

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

# 项目部署参考文献  https://mp.weixin.qq.com/s/9Iw6gaGdLMbs3Ai3JB6nig

# nginx:

# http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
 # server {
    listen 80; # 监听的端口
    server_name 自己的服务器地址; # 域名或ip    
    location / {  # 访问路径配置
      root /usr/local/ruoyi/dist/;# 根目录
      try_files $uri $uri/ /index.html;
      index index.html index.htm; # 默认首页
    }        
    location /prod-api/ {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header REMOTE-HOST $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass http://localhost:8080/; # 后台地址
    }       
#  }
# }

